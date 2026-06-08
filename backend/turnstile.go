package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// siteVerifyURL is Cloudflare's Turnstile token verification endpoint.
const siteVerifyURL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

// verifyTimeout bounds the whole siteverify exchange so a slow Cloudflare
// response can't hold the request handler open.
const verifyTimeout = 8 * time.Second

// tokenVerifier validates a client-supplied challenge token. Implementations
// must be safe for concurrent use.
type tokenVerifier interface {
	// verify reports whether the token is valid. A non-nil error means the
	// check could not be completed (e.g. network failure) and is distinct from
	// a definitive "token is invalid" (false, nil).
	verify(ctx context.Context, token, remoteIP string) (bool, error)
}

// noOpVerifier is used when Turnstile is not configured: every token passes.
// This keeps the contact form working in local/dev and in tests where no
// secret is set, exactly as newMailer falls back to a no-op mailer.
type noOpVerifier struct{}

func (noOpVerifier) verify(context.Context, string, string) (bool, error) { return true, nil }

// turnstileVerifier verifies tokens against Cloudflare's siteverify API.
type turnstileVerifier struct {
	secret string
	client *http.Client
	url    string // overridable in tests
}

// newVerifier returns a turnstileVerifier when a secret is configured, or a
// noOpVerifier otherwise (so callers never need a nil check).
func newVerifier(secret string) tokenVerifier {
	if secret == "" {
		return noOpVerifier{}
	}
	return &turnstileVerifier{
		secret: secret,
		client: &http.Client{Timeout: verifyTimeout},
		url:    siteVerifyURL,
	}
}

// siteVerifyResponse is the subset of Cloudflare's response we care about.
type siteVerifyResponse struct {
	Success    bool     `json:"success"`
	ErrorCodes []string `json:"error-codes"`
}

func (v *turnstileVerifier) verify(ctx context.Context, token, remoteIP string) (bool, error) {
	// An empty token is a definitive failure, not an error — no point calling out.
	if token == "" {
		return false, nil
	}

	form := url.Values{}
	form.Set("secret", v.secret)
	form.Set("response", token)
	if remoteIP != "" {
		form.Set("remoteip", remoteIP)
	}

	ctx, cancel := context.WithTimeout(ctx, verifyTimeout)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, v.url, strings.NewReader(form.Encode()))
	if err != nil {
		return false, fmt.Errorf("turnstile request: %w", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := v.client.Do(req)
	if err != nil {
		return false, fmt.Errorf("turnstile call: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		// Drain a little so the connection can be reused, then report.
		_, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 4<<10))
		return false, fmt.Errorf("turnstile status %d", resp.StatusCode)
	}

	var out siteVerifyResponse
	if err := json.NewDecoder(io.LimitReader(resp.Body, 64<<10)).Decode(&out); err != nil {
		return false, fmt.Errorf("turnstile decode: %w", err)
	}
	return out.Success, nil
}
