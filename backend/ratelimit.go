package main

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

type ipEntry struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

// RateLimiter manages per-IP token-bucket limiters (3 requests per minute).
type RateLimiter struct {
	mu      sync.Mutex
	clients map[string]*ipEntry
}

func NewRateLimiter() *RateLimiter {
	rl := &RateLimiter{
		clients: make(map[string]*ipEntry),
	}
	go rl.cleanup()
	return rl
}

func (rl *RateLimiter) get(ip string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	e, ok := rl.clients[ip]
	if !ok {
		// 3 requests per minute: refill 1 token every 20s, burst of 3.
		e = &ipEntry{
			limiter: rate.NewLimiter(rate.Every(20*time.Second), 3),
		}
		rl.clients[ip] = e
	}
	e.lastSeen = time.Now()
	return e.limiter
}

// Allow reports whether the client at ip may proceed.
func (rl *RateLimiter) Allow(ip string) bool {
	return rl.get(ip).Allow()
}

// cleanup removes stale entries every minute.
func (rl *RateLimiter) cleanup() {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()
	for range ticker.C {
		rl.removeStale(3 * time.Minute)
	}
}

// removeStale drops entries not seen within maxAge.
func (rl *RateLimiter) removeStale(maxAge time.Duration) {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	for ip, e := range rl.clients {
		if time.Since(e.lastSeen) > maxAge {
			delete(rl.clients, ip)
		}
	}
}

// clientIP extracts the originating IP from the request.
// nginx sets X-Real-IP; fall back to X-Forwarded-For, then RemoteAddr.
func clientIP(r *http.Request) string {
	if xrip := r.Header.Get("X-Real-IP"); xrip != "" {
		return strings.TrimSpace(xrip)
	}
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		if i := strings.Index(xff, ","); i >= 0 {
			return strings.TrimSpace(xff[:i])
		}
		return strings.TrimSpace(xff)
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
