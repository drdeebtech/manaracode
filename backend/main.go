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
	"syscall"
	"time"
)

type server struct {
	store   *Store
	limiter *RateLimiter
	mailer  Mailer
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
		resp, err := http.Get("http://localhost:8080/healthz")
		if err != nil || resp.StatusCode != http.StatusOK {
			os.Exit(1)
		}
		os.Exit(0)
	}

	// Structured JSON logging to stdout — container-friendly.
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	srv, err := newServer(loadConfig())
	if err != nil {
		slog.Error("init server", "err", err)
		os.Exit(1)
	}
	defer srv.store.Close()

	// Graceful shutdown on SIGINT / SIGTERM.
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	serve(srv.httpServer(), quit)
}

// serve runs httpSrv until a value arrives on quit (or it is closed), then
// shuts the server down gracefully with a 10-second deadline.
func serve(httpSrv *http.Server, quit <-chan os.Signal) {
	go func() {
		slog.Info("listening", "addr", httpSrv.Addr)
		if err := httpSrv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server error", "err", err)
			os.Exit(1)
		}
	}()

	<-quit

	slog.Info("shutting down")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := httpSrv.Shutdown(ctx); err != nil {
		slog.Error("shutdown error", "err", err)
	}
}
