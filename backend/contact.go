package main

// Contact is a single contact-form submission as it flows through the
// application: validated in the handler, persisted by the store, and
// announced by the mailer.
type Contact struct {
	Name    string
	Email   string
	Message string
	IP      string
}
