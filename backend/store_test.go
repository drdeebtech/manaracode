package main

import (
	"path/filepath"
	"testing"
)

func newTestStore(t *testing.T) *Store {
	t.Helper()
	dbPath := filepath.Join(t.TempDir(), "test.db")
	store, err := NewStore(dbPath)
	if err != nil {
		t.Fatalf("NewStore: %v", err)
	}
	t.Cleanup(func() { _ = store.Close() })
	return store
}

func TestNewStoreCreatesSchema(t *testing.T) {
	store := newTestStore(t)

	// The contacts table must exist immediately after construction.
	var name string
	row := store.db.QueryRow(`SELECT name FROM sqlite_master WHERE type='table' AND name='contacts'`)
	if err := row.Scan(&name); err != nil {
		t.Fatalf("contacts table not created: %v", err)
	}
	if name != "contacts" {
		t.Fatalf("expected table 'contacts', got %q", name)
	}
}

func TestSaveContactRoundTrip(t *testing.T) {
	store := newTestStore(t)

	c := Contact{Name: "Jane Doe", Email: "jane@example.com", Message: "Hello there", IP: "203.0.113.7"}
	if err := store.SaveContact(c); err != nil {
		t.Fatalf("SaveContact: %v", err)
	}

	var got Contact
	row := store.db.QueryRow(`SELECT name, email, message, ip FROM contacts WHERE id = 1`)
	if err := row.Scan(&got.Name, &got.Email, &got.Message, &got.IP); err != nil {
		t.Fatalf("scan saved row: %v", err)
	}
	if got != c {
		t.Fatalf("round-trip mismatch: got %+v, want %+v", got, c)
	}
}

func TestSaveContactMultiple(t *testing.T) {
	store := newTestStore(t)

	for i := 0; i < 3; i++ {
		if err := store.SaveContact(Contact{Name: "A", Email: "a@b.com", Message: "m", IP: "1.1.1.1"}); err != nil {
			t.Fatalf("SaveContact #%d: %v", i, err)
		}
	}

	var count int
	if err := store.db.QueryRow(`SELECT COUNT(*) FROM contacts`).Scan(&count); err != nil {
		t.Fatalf("count: %v", err)
	}
	if count != 3 {
		t.Fatalf("expected 3 rows, got %d", count)
	}
}
