# Architecture

How manaracode fits together — read this once instead of grepping the tree.
Scope: the three flows that aren't obvious from file names, plus the *why*
behind the stack. For day-to-day rules (PR flow, deploy, UI checklist) see
[CLAUDE.md](CLAUDE.md); for design tokens see
[design-system/manaracode/MASTER.md](design-system/manaracode/MASTER.md).

## System map

```
Browser ── React SPA (frontend/, Vite) ──HTTP /api──▶ Go API (backend/)
              │                                          │
              │ build step                               ├─ SQLite (store.go)
              ▼                                          └─ SMTP (mailer.go)
        dist/<route>/index.html              nginx reverse proxy fronts both
        (prerendered <head> per route)       (infrastructure/, AWS CDK + Docker)
```

- **frontend/** — React 18 + Vite 6 SPA. Routes are static-imported in
  `src/App.jsx` (no per-page lazy split); the only lazy chunk is the 3D layer.
- **backend/** — single Go service, stdlib `http.ServeMux` (Go 1.22 method
  routing, no third-party router). One real endpoint: `POST /api/contact`,
  plus `GET /healthz`.
- **infrastructure/** — AWS CDK (TypeScript) + Docker + nginx + Cloudflare.

## Flow: contact form → email

The one request path with real logic. Trace it through these files:

1. `frontend/src/components/CTA.jsx` — holds form state + the Cloudflare
   Turnstile token (`components/Turnstile.jsx`). On submit calls `postContact`.
   If the Turnstile widget can't init (error 110200) it falls back to a plain
   email link instead of trapping the user in a re-verify loop.
2. `frontend/src/lib/api.js` — `postContact(form, token)` POSTs JSON to
   `${VITE_API_BASE ?? '/api'}/contact`. Returns the raw `Response` so the
   caller branches on status (429 / 403 / !ok).
3. `backend/handler.go` — `handleContact` runs the gauntlet **in this order**:
   - `clientIP(r)` → `ratelimit.go` `Allow(ip)` → 429 if exceeded
   - decode JSON (`MaxBytesReader` 1 MB, `DisallowUnknownFields`) → 400 on bad input
   - validate name (≤100), message (≤5000), email (`mail.ParseAddress`) → 400
   - `turnstile.go` `verify(ctx, token, ip)` **before any DB write**, fail-closed:
     reach error → 503, invalid → 403
   - `store.go` `SaveContact` → SQLite → 500 on failure
   - email sent in a **background goroutine** off the request path; an
     `inflight` WaitGroup lets graceful shutdown drain pending sends
   - 200 `{"status":"ok"}`
4. Logs carry **no PII** (no name/email/IP) by design — only coarse signals.

## Flow: 3D layer lifecycle (decorative, optional)

Three.js never blocks interaction and never ships in the initial bundle.

- `frontend/src/three/SceneCanvas.jsx` is the gate. It mounts the engine only
  when **all** hold: WebGL supported (`hooks/useWebGLSupport`), motion allowed
  (`hooks/useReducedMotion`), viewport ≥ 768px, **and** first idle has passed
  (`requestIdleCallback`). Otherwise it renders `null` and three.js is never
  downloaded — the DOM controls look and behave identically.
- `lazy(() => import('./Scene3D.lazy.jsx'))` forces the whole three/gsap graph
  into a separate chunk.
- `three/engine/Engine.js` is the WebGL state machine; `LogoMark3D.jsx`,
  `engine/glow.js`, `gltf.js`, `gsapHooks.js`, `mapping.js`, `registry.js` are
  its parts.
- The `webgl` Button variant registers its rect via `hooks/useThreeButton` —
  a no-op until the engine is mounted. 3D is layered *behind* a real `<button>`.

## Flow: SEO / prerender

Vite emits a single `dist/index.html`, so every route would otherwise ship the
homepage's `<head>`. The prerender step fixes that for non-JS crawlers
(LinkedIn, Slack, Twitter, SERP snippets).

- `frontend/scripts/prerender.js` runs **after** `vite build`. It reads the
  built `dist/index.html` as a template and writes one HTML file per route with
  the correct title/description/canonical/OG/Twitter tags. It **throws** if an
  expected tag is missing, so a template change can't silently ship stale meta.
- Per-route metadata lives in `frontend/src/seo/routeMeta.js`.
- In-app `<head>` updates: `components/PageMeta.jsx`; JSON-LD structured data:
  `components/StructuredData.jsx`.
- nginx serves `dist/<route>/index.html` via `try_files $uri $uri/ /index.html`
  — no server change needed when adding a route (add it to `routeMeta.js`).

## Decisions (the "why", so agents don't re-litigate)

- **Vite SPA, not Next.js** — a marketing/portfolio site; client routing plus a
  build-time prerender covers SEO without a Node server at runtime.
- **Three.js, lazy + gated** — decorative depth without a perf/data cost on
  mobile or reduced-motion; it must never be load-bearing.
- **`modernc.org/sqlite` (pure Go), not `database/sql` + CGO** — no C toolchain,
  fully static binary, trivial container builds.
- **No TypeScript; JSDoc `@typedef` instead** — the JS surface is small and the
  `ui/` primitives carry full `@typedef`/`@property` prop contracts (see
  `ui/Button/Button.jsx`), giving editor types without a compile step. The Go
  backend carries the heavier type-safety load.
- **stdlib `http.ServeMux`** — Go 1.22 method routing removed the need for a
  router dependency.
- **Tailwind + design tokens** (`styles/tokens.css`, `design-system/`) — single
  source of truth for color/space/motion; components reference tokens, not raw values.

## Where to make common changes

| Want to… | Touch |
|----------|-------|
| Add a page/route | `src/App.jsx` + `src/pages/` + `src/seo/routeMeta.js` |
| Change a UI primitive's API | `src/ui/<Name>/` (re-exported by `src/ui/index.js`) |
| Adjust contact validation / limits | `backend/handler.go`, `backend/ratelimit.go` |
| Change bot defense | `backend/turnstile.go`, `frontend/src/components/Turnstile.jsx` |
| Tune the 3D layer | `src/three/` (gate in `SceneCanvas.jsx`) |
| Edit design tokens | `src/styles/tokens.css` + `design-system/manaracode/MASTER.md` |
