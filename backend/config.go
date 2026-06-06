package main

import "os"

// Config holds runtime configuration sourced from the environment.
type Config struct {
	DBPath   string
	SMTPHost string
	SMTPPort string
	SMTPUser string
	SMTPPass string
	SMTPFrom string
	NotifyTo string
}

// loadConfig reads configuration from the environment, applying the same
// defaults the server has always used. SMTP fields are passed through as-is;
// newMailer decides whether they are complete and supplies the port default.
func loadConfig() Config {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "/data/contacts.db"
	}

	return Config{
		DBPath:   dbPath,
		SMTPHost: os.Getenv("SMTP_HOST"),
		SMTPPort: os.Getenv("SMTP_PORT"),
		SMTPUser: os.Getenv("SMTP_USER"),
		SMTPPass: os.Getenv("SMTP_PASS"),
		SMTPFrom: os.Getenv("SMTP_FROM"),
		NotifyTo: os.Getenv("NOTIFY_TO"),
	}
}
