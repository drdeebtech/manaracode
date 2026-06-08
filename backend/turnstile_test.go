package main

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestNewVerifier(t *testing.T) {
	if _, ok := newVerifier("").(noOpVerifier); !ok {
		t.Fatalf("empty secret should yield noOpVerifier")
	}
	if _, ok := newVerifier("sec").(*turnstileVerifier); !ok {
		t.Fatalf("non-empty secret should yield *turnstileVerifier")
	}
}

// fakeSiteVerify returns a server that answers siteverify with the given
// success value, plus the count of requests it received.
func fakeSiteVerify(t *testing.T, success bool, status int) (*turnstileVerifier, *int) {
	t.Helper()
	calls := 0
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls++
		// The handler must send a urlencoded form with the secret + response.
		_ = r.ParseForm()
		if r.FormValue("secret") == "" || r.FormValue("response") == "" {
			t.Errorf("missing secret/response in siteverify request: %v", r.Form)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		if success {
			_, _ = w.Write([]byte(`{"success":true}`))
		} else {
			_, _ = w.Write([]byte(`{"success":false,"error-codes":["invalid-input-response"]}`))
		}
	}))
	t.Cleanup(srv.Close)
	v := &turnstileVerifier{secret: "test-secret", client: srv.Client(), url: srv.URL}
	return v, &calls
}

func TestTurnstileVerify(t *testing.T) {
	t.Run("valid token", func(t *testing.T) {
		v, calls := fakeSiteVerify(t, true, http.StatusOK)
		ok, err := v.verify(context.Background(), "tok", "203.0.113.1")
		if err != nil || !ok {
			t.Fatalf("want (true,nil), got (%v,%v)", ok, err)
		}
		if *calls != 1 {
			t.Fatalf("expected 1 siteverify call, got %d", *calls)
		}
	})

	t.Run("invalid token", func(t *testing.T) {
		v, _ := fakeSiteVerify(t, false, http.StatusOK)
		ok, err := v.verify(context.Background(), "tok", "")
		if err != nil || ok {
			t.Fatalf("want (false,nil), got (%v,%v)", ok, err)
		}
	})

	t.Run("empty token short-circuits without a call", func(t *testing.T) {
		v, calls := fakeSiteVerify(t, true, http.StatusOK)
		ok, err := v.verify(context.Background(), "", "")
		if err != nil || ok {
			t.Fatalf("want (false,nil), got (%v,%v)", ok, err)
		}
		if *calls != 0 {
			t.Fatalf("empty token must not call siteverify, got %d calls", *calls)
		}
	})

	t.Run("upstream non-200 is an error (fail closed)", func(t *testing.T) {
		v, _ := fakeSiteVerify(t, true, http.StatusInternalServerError)
		ok, err := v.verify(context.Background(), "tok", "")
		if err == nil || ok {
			t.Fatalf("want (false,err), got (%v,%v)", ok, err)
		}
	})
}

// TestHandleContactTurnstile checks the handler rejects bad tokens with 403 and
// accepts valid ones, when a real verifier is wired.
func TestHandleContactTurnstile(t *testing.T) {
	body := `{"name":"Jo","email":"jo@example.com","message":"hi","turnstile_token":"tok"}`

	t.Run("rejects an invalid token with 403", func(t *testing.T) {
		srv, _ := newTestServer(t)
		v, _ := fakeSiteVerify(t, false, http.StatusOK)
		srv.turnstile = v
		if w := post(t, srv, body, "203.0.113.21"); w.Code != http.StatusForbidden {
			t.Fatalf("status = %d, want 403; body=%s", w.Code, w.Body.String())
		}
	})

	t.Run("accepts a valid token with 200", func(t *testing.T) {
		srv, _ := newTestServer(t)
		v, _ := fakeSiteVerify(t, true, http.StatusOK)
		srv.turnstile = v
		if w := post(t, srv, body, "203.0.113.22"); w.Code != http.StatusOK {
			t.Fatalf("status = %d, want 200; body=%s", w.Code, w.Body.String())
		}
	})

	t.Run("upstream failure fails closed with 503", func(t *testing.T) {
		srv, _ := newTestServer(t)
		v, _ := fakeSiteVerify(t, true, http.StatusBadGateway)
		srv.turnstile = v
		if w := post(t, srv, body, "203.0.113.23"); w.Code != http.StatusServiceUnavailable {
			t.Fatalf("status = %d, want 503; body=%s", w.Code, w.Body.String())
		}
	})
}
