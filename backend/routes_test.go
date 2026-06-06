package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestRoutesHealthz(t *testing.T) {
	srv, _ := newTestServer(t)
	ts := httptest.NewServer(srv.routes())
	t.Cleanup(ts.Close)

	resp, err := http.Get(ts.URL + "/healthz")
	if err != nil {
		t.Fatalf("GET /healthz: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("healthz status = %d, want 200", resp.StatusCode)
	}
}

func TestRoutesContactThroughMux(t *testing.T) {
	srv, _ := newTestServer(t)
	ts := httptest.NewServer(srv.routes())
	t.Cleanup(ts.Close)

	body := `{"name":"Jo","email":"jo@example.com","message":"hi"}`
	req, _ := http.NewRequest("POST", ts.URL+"/api/contact", strings.NewReader(body))
	req.Header.Set("X-Real-IP", "192.0.2.123")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("POST /api/contact: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("contact status = %d, want 200", resp.StatusCode)
	}
}

func TestRoutesMethodNotAllowed(t *testing.T) {
	srv, _ := newTestServer(t)
	ts := httptest.NewServer(srv.routes())
	t.Cleanup(ts.Close)

	// GET on a POST-only route must not reach the handler.
	resp, err := http.Get(ts.URL + "/api/contact")
	if err != nil {
		t.Fatalf("GET /api/contact: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want 405", resp.StatusCode)
	}
}
