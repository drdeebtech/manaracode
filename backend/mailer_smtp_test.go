package main

import (
	"bufio"
	"net"
	"strings"
	"sync"
	"testing"
)

// fakeSMTPServer is a minimal in-process SMTP server sufficient to drive
// net/smtp's client through the full send sequence. It captures the DATA
// payload so tests can assert on the message that was actually transmitted.
// PlainAuth permits unencrypted auth over 127.0.0.1, so no TLS is needed.
type fakeSMTPServer struct {
	addr string
	ln   net.Listener
	wg   sync.WaitGroup

	mu   sync.Mutex
	data string
}

func startFakeSMTP(t *testing.T) *fakeSMTPServer {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	s := &fakeSMTPServer{addr: ln.Addr().String(), ln: ln}
	s.wg.Add(1)
	go s.serve()
	t.Cleanup(func() {
		_ = ln.Close()
		s.wg.Wait()
	})
	return s
}

func (s *fakeSMTPServer) host() string {
	h, _, _ := net.SplitHostPort(s.addr)
	return h
}

func (s *fakeSMTPServer) port() string {
	_, p, _ := net.SplitHostPort(s.addr)
	return p
}

func (s *fakeSMTPServer) capturedData() string {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.data
}

func (s *fakeSMTPServer) serve() {
	defer s.wg.Done()
	conn, err := s.ln.Accept()
	if err != nil {
		return
	}
	defer conn.Close()

	r := bufio.NewReader(conn)
	write := func(line string) { _, _ = conn.Write([]byte(line + "\r\n")) }

	write("220 fake ESMTP")
	inData := false
	var body strings.Builder

	for {
		line, err := r.ReadString('\n')
		if err != nil {
			return
		}

		if inData {
			if line == ".\r\n" {
				inData = false
				s.mu.Lock()
				s.data = body.String()
				s.mu.Unlock()
				write("250 OK queued")
				continue
			}
			body.WriteString(line)
			continue
		}

		cmd := strings.ToUpper(strings.TrimSpace(line))
		switch {
		case strings.HasPrefix(cmd, "EHLO"), strings.HasPrefix(cmd, "HELO"):
			write("250-127.0.0.1")
			write("250 AUTH PLAIN")
		case strings.HasPrefix(cmd, "AUTH"):
			write("235 2.7.0 accepted")
		case strings.HasPrefix(cmd, "MAIL FROM"):
			write("250 OK")
		case strings.HasPrefix(cmd, "RCPT TO"):
			write("250 OK")
		case cmd == "DATA":
			inData = true
			write("354 end with <CR><LF>.<CR><LF>")
		case cmd == "QUIT":
			write("221 bye")
			return
		default:
			write("250 OK")
		}
	}
}

func TestSMTPMailerSendsAndSanitizesHeaders(t *testing.T) {
	srv := startFakeSMTP(t)

	m := newMailer(srv.host(), srv.port(), "user", "pass", "from@example.com", "to@example.com")
	sm, ok := m.(*smtpMailer)
	if !ok {
		t.Fatalf("expected *smtpMailer, got %T", m)
	}

	// Name/email carry CRLF injection attempts that must be stripped.
	c := Contact{
		Name:    "Eve\r\nBcc: victim@example.com",
		Email:   "eve@example.com\r\nSubject: spoofed",
		Message: "legit message body",
	}
	if err := sm.SendContactNotification(c); err != nil {
		t.Fatalf("SendContactNotification: %v", err)
	}

	data := srv.capturedData()
	if data == "" {
		t.Fatal("server captured no DATA payload")
	}
	// The injected header lines must not appear as standalone headers.
	if strings.Contains(data, "\r\nBcc: victim@example.com") {
		t.Fatalf("CRLF injection in name was not sanitized:\n%s", data)
	}
	if strings.Contains(data, "\r\nSubject: spoofed") {
		t.Fatalf("CRLF injection in email was not sanitized:\n%s", data)
	}
	if !strings.Contains(data, "legit message body") {
		t.Fatalf("message body missing from payload:\n%s", data)
	}
}
