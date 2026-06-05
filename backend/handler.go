package main

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"net/mail"
	"strings"
)

type contactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

// handleContact processes POST /api/contact.
func (s *server) handleContact(w http.ResponseWriter, r *http.Request) {
	ip := clientIP(r)

	if !s.limiter.Allow(ip) {
		writeJSON(w, http.StatusTooManyRequests, map[string]string{
			"error": "rate limit exceeded — try again in a minute",
		})
		return
	}

	dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)) // 1 MB cap
	dec.DisallowUnknownFields()

	var req contactRequest
	if err := dec.Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	req.Message = strings.TrimSpace(req.Message)

	switch {
	case req.Name == "" || len(req.Name) > 100:
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "name is required and must be 100 characters or fewer",
		})
		return
	case req.Message == "" || len(req.Message) > 5000:
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "message is required and must be 5000 characters or fewer",
		})
		return
	}

	if _, err := mail.ParseAddress(req.Email); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "a valid email address is required",
		})
		return
	}

	if err := s.store.SaveContact(req.Name, req.Email, req.Message, ip); err != nil {
		slog.Error("save contact", "err", err, "ip", ip)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal error"})
		return
	}

	slog.Info("contact saved", "name", req.Name, "email", req.Email, "ip", ip)
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func writeJSON(w http.ResponseWriter, code int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(body)
}
