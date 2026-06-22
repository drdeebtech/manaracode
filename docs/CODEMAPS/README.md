# Codemap

Compressed index of the tree, by area. Find the right file here, then open it —
instead of grepping. For *how the parts connect* and *why*, see
[../../ARCHITECTURE.md](../../ARCHITECTURE.md).

> Maintenance: this is a hand-written index — update it when you add/move a
> directory or a public symbol. It's the artifact most likely to drift; if a row
> looks stale, trust the code and fix the row. Regenerate with `/update-codemaps`
> if you prefer automation.

## frontend/src

| Area | Key files | What's there |
|------|-----------|--------------|
| Entry | `main.jsx`, `App.jsx` | Bootstrap; `BrowserRouter` + routes + shared Navbar/Footer + skip link |
| `pages/` | `Home`, `About`, `Work`, `Privacy`, `Terms`, `NotFound` | One component per route |
| `components/` | `Hero`, `CTA`, `Navbar`, `Footer`, `Services`, `Process`, `Stats`, `Testimonials`, `TechStack`, `WorkTeaser`, `BrandLogo`, `LegalPage` | Page sections + chrome |
| `components/` (SEO) | `PageMeta`, `StructuredData` | In-app `<head>` + JSON-LD |
| `components/` (form) | `CTA`, `Turnstile` | Contact form + Cloudflare bot widget |
| `ui/` | atoms re-exported by `ui/index.js`: `Button`, `Input`, `Textarea`, `Card`, `Badge`, `Spinner`, `Skeleton`, `EmptyState`, `ErrorBoundary`, `Modal`, `Tooltip`, `Toast`(+`ToastProvider`/`useToast`), `Tabs`, `Accordion` | Design-system primitives; each has JSDoc `@typedef` prop contracts |
| `three/` | `SceneCanvas` (gate), `Scene3D.lazy`, `LogoMark3D`, `engine/Engine` (+`glow`,`gltf`,`gsapHooks`,`logoMark`,`mapping`,`registry`) | Optional, lazy WebGL layer |
| `hooks/` | `useWebGLSupport`, `useReducedMotion`, `useThreeButton`, `useFocusTrap`, `useId` | Feature-detect + a11y + 3D-button hooks |
| `lib/` | `api.js` (`postContact`, `API_BASE`), `cn.js`, `a11y.js` (`FOCUS_RING`) | API client + class-merge + a11y helpers |
| `seo/` | `routeMeta.js` (`SITE_URL`, `routeMeta`) | Per-route title/description/canonical/OG |
| `styles/` | `tokens.css` (`EASE` + CSS tokens) | Design tokens (referenced, never hardcoded) |
| `content/` | static content | Copy used by sections |

Build helper: `frontend/scripts/prerender.js` — bakes per-route `<head>` into
static HTML after `vite build`.

## backend (Go, package `main`)

| File | Public surface | What's there |
|------|----------------|--------------|
| `main.go` | `main`, `run`, `serve`, `newServer` | Entry, ServeMux (`POST /api/contact`, `GET /healthz`), graceful shutdown |
| `handler.go` | `handleContact` | Rate-limit → validate → Turnstile → store → async email |
| `ratelimit.go` | `RateLimiter`, `Allow` | Per-IP limiter |
| `turnstile.go` | `tokenVerifier`, `verify` | Cloudflare bot verify, fail-closed |
| `mailer.go` | `Mailer`, `SendContactNotification` | SMTP send (or no-op) |
| `store.go` | `Store`, `SaveContact` | SQLite (`modernc.org/sqlite`, pure Go) |
| `contact.go` | `Contact` | Submission model |
| `config.go` | `Config`, `loadConfig` | Env-var config |

Tests are colocated (`*_test.go`); backend test code outweighs source.

## infrastructure/ (AWS CDK, TypeScript)

`bin/` (app entry) · `lib/` (stack definitions) · `test/` · Docker + nginx +
Cloudflare. See `infrastructure/README.md`.
