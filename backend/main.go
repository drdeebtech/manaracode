package main

import (
	"context"
	"errors"
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

func main() {
	// Structured JSON logging to stdout — container-friendly.
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "/data/contacts.db"
	}

	store, err := NewStore(dbPath)
	if err != nil {
		slog.Error("init store", "err", err)
		os.Exit(1)
	}
	defer store.Close()

	mailer := newMailer(
		os.Getenv("SMTP_HOST"),
		os.Getenv("SMTP_PORT"),
		os.Getenv("SMTP_USER"),
		os.Getenv("SMTP_PASS"),
		os.Getenv("SMTP_FROM"),
		os.Getenv("NOTIFY_TO"),
	)

	srv := &server{
		store:   store,
		limiter: NewRateLimiter(),
		mailer:  mailer,
	}

	mux := http.NewServeMux()

	// Go 1.22+ method-prefixed routing — no third-party router needed.
	mux.HandleFunc("POST /api/contact", srv.handleContact)
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	httpSrv := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	// Start server in background.
	go func() {
		slog.Info("listening", "addr", httpSrv.Addr)
		if err := httpSrv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server error", "err", err)
			os.Exit(1)
		}
	}()

	// Graceful shutdown on SIGINT / SIGTERM.
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	slog.Info("shutting down")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := httpSrv.Shutdown(ctx); err != nil {
		slog.Error("shutdown error", "err", err)
	}
}
