package main

import (
	"crypto/tls"
	"fmt"
	"net"
	"net/smtp"
	"strings"
	"time"
)

// smtpTimeout bounds the whole SMTP exchange (dial + dialogue) so a slow or
// unresponsive relay can never block indefinitely.
const smtpTimeout = 15 * time.Second

// Mailer sends email notifications for new contact submissions.
type Mailer interface {
	SendContactNotification(c Contact) error
}

// noOpMailer is used when SMTP is not configured.
type noOpMailer struct{}

func (noOpMailer) SendContactNotification(_ Contact) error { return nil }

// smtpMailer sends email via STARTTLS SMTP (port 587).
type smtpMailer struct {
	host string
	port string
	user string
	pass string
	from string
	to   string
}

// newMailer returns an smtpMailer when all required env vars are set,
// or a noOpMailer if any are missing.
func newMailer(host, port, user, pass, from, to string) Mailer {
	if host == "" || user == "" || pass == "" || from == "" || to == "" {
		return noOpMailer{}
	}
	if port == "" {
		port = "587"
	}
	return &smtpMailer{host: host, port: port, user: user, pass: pass, from: from, to: to}
}

func (m *smtpMailer) SendContactNotification(c Contact) error {
	// Sanitise header fields — strip newlines to prevent header injection.
	safeName := strings.NewReplacer("\r", "", "\n", " ").Replace(c.Name)
	safeEmail := strings.NewReplacer("\r", "", "\n", "").Replace(c.Email)

	subject := fmt.Sprintf("New contact from %s", safeName)

	header := strings.Join([]string{
		"From: " + m.from,
		"To: " + m.to,
		"Reply-To: " + safeName + " <" + safeEmail + ">",
		"Subject: " + subject,
		"MIME-Version: 1.0",
		"Content-Type: text/plain; charset=UTF-8",
	}, "\r\n")

	body := fmt.Sprintf("Name:    %s\r\nEmail:   %s\r\n\r\nMessage:\r\n%s\r\n\r\n---\r\nSent via manaracode.com contact form\r\n",
		safeName, safeEmail, c.Message)

	msg := []byte(header + "\r\n\r\n" + body)

	addr := net.JoinHostPort(m.host, m.port)
	conn, err := net.DialTimeout("tcp", addr, smtpTimeout)
	if err != nil {
		return fmt.Errorf("smtp dial: %w", err)
	}
	defer conn.Close()
	// One deadline covers the entire dialogue (handshake, auth, DATA).
	if err := conn.SetDeadline(time.Now().Add(smtpTimeout)); err != nil {
		return fmt.Errorf("smtp deadline: %w", err)
	}

	client, err := smtp.NewClient(conn, m.host)
	if err != nil {
		return fmt.Errorf("smtp client: %w", err)
	}
	defer client.Close()

	// Upgrade to TLS when the server advertises STARTTLS (real relays do; the
	// in-process test server does not, in which case PlainAuth still permits
	// auth over a loopback connection).
	if ok, _ := client.Extension("STARTTLS"); ok {
		if err := client.StartTLS(&tls.Config{ServerName: m.host, MinVersion: tls.VersionTLS12}); err != nil {
			return fmt.Errorf("smtp starttls: %w", err)
		}
	}
	if ok, _ := client.Extension("AUTH"); ok {
		if err := client.Auth(smtp.PlainAuth("", m.user, m.pass, m.host)); err != nil {
			return fmt.Errorf("smtp auth: %w", err)
		}
	}

	if err := client.Mail(m.from); err != nil {
		return fmt.Errorf("smtp mail from: %w", err)
	}
	if err := client.Rcpt(m.to); err != nil {
		return fmt.Errorf("smtp rcpt to: %w", err)
	}
	wc, err := client.Data()
	if err != nil {
		return fmt.Errorf("smtp data: %w", err)
	}
	if _, err := wc.Write(msg); err != nil {
		return fmt.Errorf("smtp write: %w", err)
	}
	if err := wc.Close(); err != nil {
		return fmt.Errorf("smtp close: %w", err)
	}
	if err := client.Quit(); err != nil {
		return fmt.Errorf("smtp quit: %w", err)
	}
	return nil
}
