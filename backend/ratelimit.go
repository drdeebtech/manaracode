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
	mu       sync.Mutex
	clients  map[string]*ipEntry
	done     chan struct{}
	stopOnce sync.Once
}

func NewRateLimiter() *RateLimiter {
	rl := &RateLimiter{
		clients: make(map[string]*ipEntry),
		done:    make(chan struct{}),
	}
	go rl.cleanup()
	return rl
}

// Stop ends the background cleanup goroutine. Idempotent — safe to call more
// than once (the sync.Once guards against a double channel close panic).
func (rl *RateLimiter) Stop() {
	rl.stopOnce.Do(func() { close(rl.done) })
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

// cleanup removes stale entries every minute until Stop is called.
func (rl *RateLimiter) cleanup() {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			rl.removeStale(3 * time.Minute)
		case <-rl.done:
			return
		}
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
//
// Proxy-set headers (CF-Connecting-IP, X-Real-IP, X-Forwarded-For) are honored
// ONLY when the direct peer (RemoteAddr) is a trusted proxy — a loopback or
// private-network address. In this deployment the Go backend's port is never
// published; it is reachable only through nginx on the private Docker network,
// so a legitimate request always arrives from a private peer. A request
// arriving from a public peer (i.e. someone hitting the backend directly)
// cannot be trusted to set these headers, so we fall back to its real
// RemoteAddr. This closes the rate-limiter bypass where a client forges a
// header to spoof its IP.
//
// CF-Connecting-IP is preferred: the site is served exclusively through
// Cloudflare (the origin security group only admits Cloudflare ranges), and
// the two-hop nginx chain rewrites X-Real-IP to a constant internal address —
// so CF-Connecting-IP is the only header that carries the true visitor IP and
// keeps the per-IP rate limiter effective.
func clientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		host = r.RemoteAddr
	}

	peer := net.ParseIP(host)
	trusted := peer != nil && (peer.IsLoopback() || peer.IsPrivate())
	if !trusted {
		return host
	}

	if cf := strings.TrimSpace(r.Header.Get("CF-Connecting-IP")); cf != "" {
		return cf
	}
	if xrip := strings.TrimSpace(r.Header.Get("X-Real-IP")); xrip != "" {
		return xrip
	}
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		if i := strings.Index(xff, ","); i >= 0 {
			return strings.TrimSpace(xff[:i])
		}
		return strings.TrimSpace(xff)
	}
	return host
}
