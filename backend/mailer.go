package main

import (
	"fmt"
	"net/smtp"
	"strings"
)

// Mailer sends email notifications for new contact submissions.
type Mailer interface {
	SendContactNotification(name, email, message string) error
}

// noOpMailer is used when SMTP is not configured.
type noOpMailer struct{}

func (noOpMailer) SendContactNotification(_, _, _ string) error { return nil }

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

func (m *smtpMailer) SendContactNotification(name, email, message string) error {
	// Sanitise header fields — strip newlines to prevent header injection.
	safeName := strings.NewReplacer("\r", "", "\n", " ").Replace(name)
	safeEmail := strings.NewReplacer("\r", "", "\n", "").Replace(email)

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
		safeName, safeEmail, message)

	msg := []byte(header + "\r\n\r\n" + body)

	auth := smtp.PlainAuth("", m.user, m.pass, m.host)
	return smtp.SendMail(m.host+":"+m.port, auth, m.from, []string{m.to}, msg)
}
