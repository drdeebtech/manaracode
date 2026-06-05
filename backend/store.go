package main

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

// Store wraps the SQLite database.
type Store struct {
	db *sql.DB
}

// NewStore opens (or creates) the SQLite database at path and ensures the schema exists.
func NewStore(path string) (*Store, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}

	// Single writer — serialise access via the connection pool.
	db.SetMaxOpenConns(1)

	const schema = `
		CREATE TABLE IF NOT EXISTS contacts (
			id         INTEGER PRIMARY KEY AUTOINCREMENT,
			name       TEXT    NOT NULL,
			email      TEXT    NOT NULL,
			message    TEXT    NOT NULL,
			ip         TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`

	if _, err := db.Exec(schema); err != nil {
		return nil, fmt.Errorf("create schema: %w", err)
	}

	return &Store{db: db}, nil
}

// SaveContact persists a contact form submission.
func (s *Store) SaveContact(name, email, message, ip string) error {
	_, err := s.db.Exec(
		`INSERT INTO contacts (name, email, message, ip) VALUES (?, ?, ?, ?)`,
		name, email, message, ip,
	)
	return err
}

// Close releases the database connection.
func (s *Store) Close() error {
	return s.db.Close()
}
