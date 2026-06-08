package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
)

// fakeMailer records the last contact it was asked to send and can be
// configured to return an error. It is concurrency-safe because emails are now
// dispatched from background goroutines.
type fakeMailer struct {
	mu     sync.Mutex
	called bool
	last   Contact
	err    error
}

func (f *fakeMailer) SendContactNotification(c Contact) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.called = true
	f.last = c
	return f.err
}

// snapshot returns the recorded state under lock (call after inflight.Wait()).
func (f *fakeMailer) snapshot() (bool, Contact) {
	f.mu.Lock()
	defer f.mu.Unlock()
	return f.called, f.last
}

func newTestServer(t *testing.T) (*server, *fakeMailer) {
	t.Helper()
	fm := &fakeMailer{}
	srv := &server{
		store:     newTestStore(t),
		limiter:   NewRateLimiter(),
		mailer:    fm,
		turnstile: noOpVerifier{},
	}
	t.Cleanup(srv.limiter.Stop) // end the cleanup goroutine so it doesn't leak per test
	// Drain any in-flight async email sends before the store (registered earlier by
	// newTestStore) is closed — cleanups run LIFO, so this fires first.
	t.Cleanup(srv.inflight.Wait)
	return srv, fm
}

// post issues a POST /api/contact with a unique source IP so the per-IP rate
// limiter does not interfere across independent test cases. RemoteAddr is set to
// a loopback (trusted proxy) so clientIP honors the forwarded X-Real-IP, exactly
// as it does behind nginx on the private network in production.
func post(t *testing.T, srv *server, body string, ip string) *httptest.ResponseRecorder {
	t.Helper()
	r := httptest.NewRequest("POST", "/api/contact", strings.NewReader(body))
	r.RemoteAddr = "127.0.0.1:12345"
	r.Header.Set("X-Real-IP", ip)
	w := httptest.NewRecorder()
	srv.handleContact(w, r)
	return w
}

func TestHandleContactSuccess(t *testing.T) {
	srv, fm := newTestServer(t)

	body := `{"name":"Jane","email":"jane@example.com","message":"Hello"}`
	w := post(t, srv, body, "198.51.100.10")

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200; body=%s", w.Code, w.Body.String())
	}
	var resp map[string]string
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if resp["status"] != "ok" {
		t.Fatalf("expected status ok, got %v", resp)
	}
	srv.inflight.Wait() // email is dispatched asynchronously; await it before asserting
	if called, last := fm.snapshot(); !called || last.Email != "jane@example.com" {
		t.Fatalf("mailer not invoked with the submission: called=%v last=%+v", called, last)
	}
}

func TestHandleContactValidation(t *testing.T) {
	longName := strings.Repeat("a", maxNameLen+1)
	maxName := strings.Repeat("a", maxNameLen)
	longMsg := strings.Repeat("b", maxMessageLen+1)
	maxMsg := strings.Repeat("b", maxMessageLen)

	tests := []struct {
		name     string
		body     string
		wantCode int
	}{
		{"valid", `{"name":"Jo","email":"jo@example.com","message":"hi"}`, http.StatusOK},
		{"name at max length", `{"name":"` + maxName + `","email":"jo@example.com","message":"hi"}`, http.StatusOK},
		{"message at max length", `{"name":"Jo","email":"jo@example.com","message":"` + maxMsg + `"}`, http.StatusOK},
		{"invalid JSON", `{not json`, http.StatusBadRequest},
		{"unknown field rejected", `{"name":"Jo","email":"jo@example.com","message":"hi","x":1}`, http.StatusBadRequest},
		{"empty name", `{"name":"","email":"jo@example.com","message":"hi"}`, http.StatusBadRequest},
		{"whitespace name", `{"name":"   ","email":"jo@example.com","message":"hi"}`, http.StatusBadRequest},
		{"name too long", `{"name":"` + longName + `","email":"jo@example.com","message":"hi"}`, http.StatusBadRequest},
		{"empty message", `{"name":"Jo","email":"jo@example.com","message":""}`, http.StatusBadRequest},
		{"message too long", `{"name":"Jo","email":"jo@example.com","message":"` + longMsg + `"}`, http.StatusBadRequest},
		{"invalid email", `{"name":"Jo","email":"not-an-email","message":"hi"}`, http.StatusBadRequest},
		{"empty email", `{"name":"Jo","email":"","message":"hi"}`, http.StatusBadRequest},
	}

	for i, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			srv, _ := newTestServer(t)
			// Unique IP per case keeps the rate limiter out of the way.
			ip := "203.0.113." + string(rune('0'+i%10)) + "0"
			w := post(t, srv, tc.body, ip)
			if w.Code != tc.wantCode {
				t.Fatalf("status = %d, want %d; body=%s", w.Code, tc.wantCode, w.Body.String())
			}
		})
	}
}

func TestHandleContactRateLimited(t *testing.T) {
	srv, _ := newTestServer(t)
	body := `{"name":"Jo","email":"jo@example.com","message":"hi"}`
	const ip = "198.51.100.99"

	// Burst of 3 allowed.
	for i := 0; i < 3; i++ {
		if w := post(t, srv, body, ip); w.Code != http.StatusOK {
			t.Fatalf("request %d: status %d, want 200", i+1, w.Code)
		}
	}
	// 4th from same IP must be rejected.
	if w := post(t, srv, body, ip); w.Code != http.StatusTooManyRequests {
		t.Fatalf("4th request: status %d, want 429", w.Code)
	}
}

func TestHandleContactStoreErrorReturns500(t *testing.T) {
	srv, _ := newTestServer(t)
	// Closing the DB forces SaveContact to fail on the next insert.
	if err := srv.store.Close(); err != nil {
		t.Fatalf("close store: %v", err)
	}

	body := `{"name":"Jo","email":"jo@example.com","message":"hi"}`
	w := post(t, srv, body, "198.51.100.55")

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want 500; body=%s", w.Code, w.Body.String())
	}
}

func TestHandleContactEmailFailureIsNonFatal(t *testing.T) {
	srv, fm := newTestServer(t)
	fm.err = errors.New("smtp down")

	body := `{"name":"Jo","email":"jo@example.com","message":"hi"}`
	w := post(t, srv, body, "198.51.100.77")

	// Submission is still saved; the user sees 200 even though email failed.
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200 (email failure must not surface)", w.Code)
	}
	srv.inflight.Wait() // let the async send (which fails) complete before teardown
	var count int
	if err := srv.store.db.QueryRow(`SELECT COUNT(*) FROM contacts`).Scan(&count); err != nil {
		t.Fatalf("count: %v", err)
	}
	if count != 1 {
		t.Fatalf("expected contact persisted despite email error, got %d rows", count)
	}
}
