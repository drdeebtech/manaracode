package main

import (
	"net/http/httptest"
	"testing"
	"time"
)

func TestRateLimiterAllowsBurstThenDenies(t *testing.T) {
	rl := NewRateLimiter()

	const ip = "198.51.100.4"
	// Burst is 3: the first three calls are allowed, the fourth is denied.
	for i := 0; i < 3; i++ {
		if !rl.Allow(ip) {
			t.Fatalf("request %d should be allowed within burst", i+1)
		}
	}
	if rl.Allow(ip) {
		t.Fatal("fourth request should be denied (burst exhausted)")
	}
}

func TestRateLimiterIsolatesByIP(t *testing.T) {
	rl := NewRateLimiter()

	// Exhaust one IP's burst.
	for i := 0; i < 3; i++ {
		rl.Allow("203.0.113.1")
	}
	if rl.Allow("203.0.113.1") {
		t.Fatal("first IP should be limited")
	}

	// A different IP must be unaffected.
	if !rl.Allow("203.0.113.2") {
		t.Fatal("second IP should be allowed independently")
	}
}

func TestRateLimiterRemoveStale(t *testing.T) {
	rl := NewRateLimiter()

	rl.Allow("10.0.0.1") // creates an entry with lastSeen = now
	// Force the entry to look old.
	rl.mu.Lock()
	rl.clients["10.0.0.1"].lastSeen = time.Now().Add(-5 * time.Minute)
	rl.mu.Unlock()

	// Add a fresh entry that must survive.
	rl.Allow("10.0.0.2")

	rl.removeStale(3 * time.Minute)

	rl.mu.Lock()
	defer rl.mu.Unlock()
	if _, ok := rl.clients["10.0.0.1"]; ok {
		t.Fatal("stale entry should have been removed")
	}
	if _, ok := rl.clients["10.0.0.2"]; !ok {
		t.Fatal("fresh entry should have survived")
	}
}

func TestClientIP(t *testing.T) {
	tests := []struct {
		name       string
		xRealIP    string
		xForwarded string
		remoteAddr string
		want       string
	}{
		{name: "X-Real-IP wins", xRealIP: "  192.0.2.10 ", remoteAddr: "10.0.0.1:5000", want: "192.0.2.10"},
		{name: "X-Forwarded-For single", xForwarded: "192.0.2.20", remoteAddr: "10.0.0.1:5000", want: "192.0.2.20"},
		{name: "X-Forwarded-For list takes first", xForwarded: "192.0.2.30, 70.1.2.3", remoteAddr: "10.0.0.1:5000", want: "192.0.2.30"},
		{name: "RemoteAddr fallback strips port", remoteAddr: "192.0.2.40:9999", want: "192.0.2.40"},
		{name: "RemoteAddr without port returned as-is", remoteAddr: "192.0.2.50", want: "192.0.2.50"},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			r := httptest.NewRequest("POST", "/api/contact", nil)
			r.RemoteAddr = tc.remoteAddr
			if tc.xRealIP != "" {
				r.Header.Set("X-Real-IP", tc.xRealIP)
			}
			if tc.xForwarded != "" {
				r.Header.Set("X-Forwarded-For", tc.xForwarded)
			}
			if got := clientIP(r); got != tc.want {
				t.Fatalf("clientIP = %q, want %q", got, tc.want)
			}
		})
	}
}
