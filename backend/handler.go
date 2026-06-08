package main

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"net/mail"
	"strings"
)

const (
	maxNameLen    = 100
	maxMessageLen = 5000
	maxBodyBytes  = 1 << 20 // 1 MB
)

type contactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	// Token is the Cloudflare Turnstile response token from the browser widget.
	// Verified server-side before the submission is accepted.
	Token string `json:"turnstile_token"`
}

// handleContact processes POST /api/contact.
func (s *server) handleContact(w http.ResponseWriter, r *http.Request) {
	ip := clientIP(r)

	if !s.limiter.Allow(ip) {
		writeError(w, http.StatusTooManyRequests, "rate limit exceeded — try again in a minute")
		return
	}

	dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, maxBodyBytes))
	dec.DisallowUnknownFields()

	var req contactRequest
	if err := dec.Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON")
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	req.Message = strings.TrimSpace(req.Message)

	switch {
	case req.Name == "" || len(req.Name) > maxNameLen:
		writeError(w, http.StatusBadRequest, "name is required and must be 100 characters or fewer")
		return
	case req.Message == "" || len(req.Message) > maxMessageLen:
		writeError(w, http.StatusBadRequest, "message is required and must be 5000 characters or fewer")
		return
	}

	if _, err := mail.ParseAddress(req.Email); err != nil {
		writeError(w, http.StatusBadRequest, "a valid email address is required")
		return
	}

	// Bot defense: verify the Turnstile token before any DB write so automated
	// submissions never reach the store or the mailer. No-op when unconfigured.
	switch ok, err := s.turnstile.verify(r.Context(), req.Token, ip); {
	case err != nil:
		// Could not reach Cloudflare — fail closed, but signal it's transient.
		slog.Error("turnstile verify failed", "err", err)
		writeError(w, http.StatusServiceUnavailable, "could not verify the challenge, please try again")
		return
	case !ok:
		writeError(w, http.StatusForbidden, "challenge verification failed, please complete it and retry")
		return
	}

	contact := Contact{Name: req.Name, Email: req.Email, Message: req.Message, IP: ip}

	if err := s.store.SaveContact(contact); err != nil {
		// No PII in logs (no name/email/ip) — just that a save failed.
		slog.Error("save contact failed", "err", err)
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	// No PII in logs: a coarse signal only.
	slog.Info("contact saved")

	// Send the notification email off the request path so a slow/unresponsive SMTP
	// relay can never delay the user's response or hold the handler goroutine.
	// inflight lets graceful shutdown drain pending sends (and tests await them).
	s.inflight.Add(1)
	go func(c Contact) {
		defer s.inflight.Done()
		if err := s.mailer.SendContactNotification(c); err != nil {
			// Non-fatal: contact is already saved. No PII in the log line.
			slog.Error("send notification email failed", "err", err)
		}
	}(contact)

	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func writeJSON(w http.ResponseWriter, code int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(body)
}

// writeError sends a JSON error response: {"error": msg}.
func writeError(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}
