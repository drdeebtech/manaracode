package main

import "testing"

func TestLoadConfigDefaults(t *testing.T) {
	// Ensure a clean environment for this test.
	for _, k := range []string{"DB_PATH", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "NOTIFY_TO"} {
		t.Setenv(k, "")
	}

	cfg := loadConfig()

	if cfg.DBPath != "/data/contacts.db" {
		t.Fatalf("DBPath default = %q, want /data/contacts.db", cfg.DBPath)
	}
	if cfg.SMTPHost != "" || cfg.SMTPPort != "" || cfg.SMTPUser != "" ||
		cfg.SMTPPass != "" || cfg.SMTPFrom != "" || cfg.NotifyTo != "" {
		t.Fatalf("expected empty SMTP fields by default, got %+v", cfg)
	}
}

func TestLoadConfigFromEnv(t *testing.T) {
	t.Setenv("DB_PATH", "/custom/path.db")
	t.Setenv("SMTP_HOST", "smtp.example.com")
	t.Setenv("SMTP_PORT", "2525")
	t.Setenv("SMTP_USER", "user")
	t.Setenv("SMTP_PASS", "secret")
	t.Setenv("SMTP_FROM", "from@example.com")
	t.Setenv("NOTIFY_TO", "to@example.com")

	cfg := loadConfig()

	want := Config{
		DBPath:   "/custom/path.db",
		SMTPHost: "smtp.example.com",
		SMTPPort: "2525",
		SMTPUser: "user",
		SMTPPass: "secret",
		SMTPFrom: "from@example.com",
		NotifyTo: "to@example.com",
	}
	if cfg != want {
		t.Fatalf("loadConfig = %+v, want %+v", cfg, want)
	}
}
