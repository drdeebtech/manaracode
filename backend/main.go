package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

type server struct {
	store    *Store
	limiter  *RateLimiter
	mailer   Mailer
	inflight sync.WaitGroup // tracks background email sends for graceful drain
}

// newServer wires the application dependencies from configuration: it opens
// the store, builds the mailer (SMTP or no-op), and starts the rate limiter.
func newServer(cfg Config) (*server, error) {
	store, err := NewStore(cfg.DBPath)
	if err != nil {
		return nil, fmt.Errorf("new store: %w", err)
	}
	mailer := newMailer(cfg.SMTPHost, cfg.SMTPPort, cfg.SMTPUser, cfg.SMTPPass, cfg.SMTPFrom, cfg.NotifyTo)
	return &server{
		store:   store,
		limiter: NewRateLimiter(),
		mailer:  mailer,
	}, nil
}

// routes builds the HTTP handler. Go 1.22+ method-prefixed routing — no
// third-party router needed.
func (s *server) routes() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/contact", s.handleContact)
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
	return mux
}

// httpServer constructs the HTTP server with its routes and timeouts.
func (s *server) httpServer() *http.Server {
	return &http.Server{
		Addr:         ":8080",
		Handler:      s.routes(),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
}

func main() {
	healthcheck := flag.Bool("healthcheck", false, "probe /healthz and exit 0/1")
	flag.Parse()

	if *healthcheck {
		os.Exit(runHealthcheck())
	}

	// Structured JSON logging to stdout — container-friendly.
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	if err := run(); err != nil {
		slog.Error("fatal", "err", err)
		os.Exit(1)
	}
}

// runHealthcheck probes /healthz with a bounded timeout and always closes the
// response body. Returns the process exit code (0 healthy, 1 otherwise).
func runHealthcheck() int {
	client := &http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get("http://localhost:8080/healthz")
	if err != nil {
		return 1
	}
	resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return 1
	}
	return 0
}

// run wires dependencies and serves until shutdown. Returning an error (instead
// of calling os.Exit deep in a goroutine) guarantees the deferred Close/Stop
// run on every exit path — including a failed ListenAndServe.
func run() error {
	srv, err := newServer(loadConfig())
	if err != nil {
		return fmt.Errorf("init server: %w", err)
	}
	defer srv.store.Close()
	defer srv.limiter.Stop()

	// Graceful shutdown on SIGINT / SIGTERM.
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	if err := serve(srv.httpServer(), quit); err != nil {
		return err
	}

	// Let in-flight background email sends finish, bounded so a hung relay can't
	// stall shutdown indefinitely.
	drained := make(chan struct{})
	go func() { srv.inflight.Wait(); close(drained) }()
	select {
	case <-drained:
	case <-time.After(5 * time.Second):
		slog.Warn("timed out waiting for in-flight email sends")
	}
	return nil
}

// serve runs httpSrv until a value arrives on quit (or it is closed) or the
// server fails to start, then shuts down gracefully with a 10-second deadline.
func serve(httpSrv *http.Server, quit <-chan os.Signal) error {
	serverErr := make(chan error, 1)
	go func() {
		slog.Info("listening", "addr", httpSrv.Addr)
		if err := httpSrv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			serverErr <- err
		}
	}()

	select {
	case err := <-serverErr:
		return fmt.Errorf("server error: %w", err)
	case <-quit:
	}

	slog.Info("shutting down")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := httpSrv.Shutdown(ctx); err != nil {
		return fmt.Errorf("shutdown: %w", err)
	}
	return nil
}
