package main

import "testing"

func TestNewMailerSelection(t *testing.T) {
	tests := []struct {
		name                             string
		host, port, user, pass, from, to string
		wantSMTP                         bool
	}{
		{name: "all set → smtp", host: "smtp.example.com", port: "587", user: "u", pass: "p", from: "f@x.com", to: "t@x.com", wantSMTP: true},
		{name: "port empty still smtp (defaulted)", host: "smtp.example.com", port: "", user: "u", pass: "p", from: "f@x.com", to: "t@x.com", wantSMTP: true},
		{name: "missing host → noop", host: "", port: "587", user: "u", pass: "p", from: "f@x.com", to: "t@x.com"},
		{name: "missing user → noop", host: "smtp.example.com", user: "", pass: "p", from: "f@x.com", to: "t@x.com"},
		{name: "missing pass → noop", host: "smtp.example.com", user: "u", pass: "", from: "f@x.com", to: "t@x.com"},
		{name: "missing from → noop", host: "smtp.example.com", user: "u", pass: "p", from: "", to: "t@x.com"},
		{name: "missing to → noop", host: "smtp.example.com", user: "u", pass: "p", from: "f@x.com", to: ""},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			m := newMailer(tc.host, tc.port, tc.user, tc.pass, tc.from, tc.to)
			switch m.(type) {
			case *smtpMailer:
				if !tc.wantSMTP {
					t.Fatalf("expected noOpMailer, got *smtpMailer")
				}
			case noOpMailer:
				if tc.wantSMTP {
					t.Fatalf("expected *smtpMailer, got noOpMailer")
				}
			default:
				t.Fatalf("unexpected mailer type %T", m)
			}
		})
	}
}

func TestNewMailerDefaultsPort(t *testing.T) {
	m := newMailer("smtp.example.com", "", "u", "p", "f@x.com", "t@x.com")
	sm, ok := m.(*smtpMailer)
	if !ok {
		t.Fatalf("expected *smtpMailer, got %T", m)
	}
	if sm.port != "587" {
		t.Fatalf("expected default port 587, got %q", sm.port)
	}
}

func TestNoOpMailerNeverErrors(t *testing.T) {
	var m Mailer = noOpMailer{}
	if err := m.SendContactNotification(Contact{Name: "x", Email: "x@y.com", Message: "m"}); err != nil {
		t.Fatalf("noOpMailer should never error, got %v", err)
	}
}
