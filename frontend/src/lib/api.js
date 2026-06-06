// API base for backend calls. Defaults to the relative `/api` path the app has
// always used (served by the nginx reverse proxy in production and the Vite dev
// proxy locally); override with VITE_API_BASE at build time if the API lives
// elsewhere.
export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

/**
 * Submit the contact form to the backend.
 *
 * Returns the raw Response so callers can branch on status (e.g. 429) exactly
 * as before. Network failures reject, matching `fetch` semantics.
 *
 * @param {{ name: string, email: string, message: string }} form
 * @returns {Promise<Response>}
 */
export function postContact(form) {
  return fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
}
