package main

import (
	"net/http"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestNewServerSuccess(t *testing.T) {
	cfg := Config{DBPath: filepath.Join(t.TempDir(), "c.db")}

	srv, err := newServer(cfg)
	if err != nil {
		t.Fatalf("newServer: %v", err)
	}
	t.Cleanup(func() { _ = srv.store.Close() })

	if srv.store == nil || srv.limiter == nil || srv.mailer == nil {
		t.Fatalf("newServer left a dependency nil: %+v", srv)
	}
	// With no SMTP config, the mailer must be the no-op implementation.
	if _, ok := srv.mailer.(noOpMailer); !ok {
		t.Fatalf("expected noOpMailer without SMTP config, got %T", srv.mailer)
	}
}

func TestHTTPServerConfig(t *testing.T) {
	srv, _ := newTestServer(t)
	h := srv.httpServer()

	if h.Addr != ":8080" {
		t.Fatalf("Addr = %q, want :8080", h.Addr)
	}
	if h.ReadTimeout != 10*time.Second || h.WriteTimeout != 10*time.Second {
		t.Fatalf("timeouts = read %v / write %v, want 10s/10s", h.ReadTimeout, h.WriteTimeout)
	}
	if h.Handler == nil {
		t.Fatal("handler must be set")
	}
}

func TestServeStartsAndShutsDown(t *testing.T) {
	// Ephemeral loopback port avoids conflicts and flakiness in CI.
	httpSrv := &http.Server{Addr: "127.0.0.1:0", Handler: http.NewServeMux()}
	quit := make(chan os.Signal, 1)

	done := make(chan struct{})
	go func() {
		serve(httpSrv, quit)
		close(done)
	}()

	// Signal shutdown; serve must return promptly via graceful Shutdown.
	close(quit)

	select {
	case <-done:
		// returned cleanly
	case <-time.After(5 * time.Second):
		t.Fatal("serve did not return after quit signal")
	}
}

func TestNewServerStoreError(t *testing.T) {
	// A path whose parent directory does not exist cannot be opened.
	cfg := Config{DBPath: filepath.Join(t.TempDir(), "missing", "dir", "c.db")}

	if _, err := newServer(cfg); err == nil {
		t.Fatal("expected error when store path is unopenable, got nil")
	}
}
