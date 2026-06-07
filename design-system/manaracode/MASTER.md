# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** manaracode
**Generated:** 2026-06-07 (regenerated to match the implemented system)
**Category:** Dev studio / marketing site
**Direction:** Dark, maximalist, motion-driven (3D-forward)

> This file documents the **implemented** design system. The source of truth in code is
> `frontend/src/styles/tokens.css` (CSS variables), `frontend/tailwind.config.js` (semantic
> color/font mapping), `frontend/src/styles/tokens.js` (JS motion tokens), and
> `frontend/index.html` (theme attribute + fonts). Keep this file in sync when those change.

---

## Global Rules

### Theme

The dark theme is **active** — `data-theme="dark"` is set on `<html>` in `index.html`. Every
token has a dark value (active) and a light fallback in `:root`, so flipping the attribute
swaps the whole theme with no code changes. Components consume tokens via Tailwind semantic
utilities (`bg-surface`, `text-fg`, `border-border`, `bg-accent-warm`, `text-on-accent`, …),
**never** hardcoded color ramps.

### Color Palette

Values are listed as **Token** (CSS variable + Tailwind utility) → **Dark (active)** →
**Light (fallback)**. Dark values are OKLCH (the source of truth); light fallbacks are hex.

| Role | CSS variable | Tailwind | Dark (active) | Light (fallback) |
|------|--------------|----------|---------------|------------------|
| Background | `--color-bg` | `bg-bg` | `oklch(13% 0.02 265)` | `#eff6ff` |
| Surface | `--color-surface` | `bg-surface` | `oklch(18% 0.02 265)` | `#ffffff` |
| Foreground (text) | `--color-text` | `text-fg` | `oklch(96% 0 0)` | `#1e3a8a` |
| Muted text | `--color-text-muted` | `text-muted` | `oklch(72% 0.02 265)` | `#2563eb` |
| Border | `--color-border` | `border-border` | `oklch(28% 0.02 265)` | `#dbeafe` |
| Focus ring | `--color-ring` | `ring-ring` | `oklch(64% 0.19 255)` | `#60a5fa` |
| Accent (primary brand) | `--color-accent` | `text-accent` / `bg-accent` | `oklch(64% 0.19 255)` (blue) | `#2563eb` |
| Accent warm (CTA fill) | `--color-accent-warm` | `bg-accent-warm` | `oklch(82% 0.17 95)` (gold) | `#22c55e` |
| Accent 2 (secondary) | `--color-accent-2` | — (atmosphere/3D only) | `oklch(62% 0.22 300)` (violet) | `#7c3aed` |
| On-accent (text on fills) | `--color-on-accent` | `text-on-accent` | `#0b1220` | `#0b1220` |
| Success | `--color-success` | `text-success` | `oklch(72% 0.17 150)` | `#16a34a` |
| Warning | `--color-warning` | `text-warning` | `oklch(80% 0.15 80)` | `#d97706` |
| Error | `--color-error` | `text-error` | `oklch(64% 0.21 25)` | `#ef4444` |
| Info | `--color-info` | `text-info` | `oklch(64% 0.19 255)` | `#2563eb` |
| Neutral soft (chips) | `--color-neutral-soft` | `bg-neutral-soft` | `oklch(24% 0.02 265)` | `#dbeafe` |
| Accent soft (halos) | `--color-accent-soft` | `bg-accent-soft` | `oklch(28% 0.06 255)` | `#dbeafe` |
| Success soft | `--color-success-soft` | `bg-success-soft` | `oklch(28% 0.06 150)` | `#dcfce7` |
| Warning soft | `--color-warning-soft` | `bg-warning-soft` | `oklch(30% 0.06 80)` | `#fef3c7` |
| Error soft | `--color-error-soft` | `bg-error-soft` | `oklch(28% 0.08 25)` | `#fee2e2` |
| Terminal surface | `--color-terminal-bg` | `bg-terminal-bg` | `oklch(12% 0.03 265)` | (always dark) |
| Terminal bar | `--color-terminal-bar` | `bg-terminal-bar` | `oklch(17% 0.03 265)` | (always dark) |

**Color notes:**

- **Blue accent** carries identity; **gold `accent-warm`** is the CTA fill; **violet `accent-2`**
  is used only in the page atmosphere (aurora) and the 3D layer, never on UI controls.
- **Always pair `accent-warm` / `accent` text-bearing fills with `text-on-accent`** (dark), never
  `text-white` — white on the light-ish gold/blue fails contrast (~1.7:1 on gold). `text-on-accent`
  clears 4.5:1.
- The **terminal motif** is intentionally always dark in both themes (a code-editor surface),
  brand-tinted rather than raw gray. ANSI line colors (`text-green-400`, `text-blue-300`,
  `text-yellow-300`) live in the component and are terminal semantics.
- **Page atmosphere:** a fixed aurora (`body::before`) blends `accent` → `accent-2` → `accent-warm`
  plus a faint SVG grain (`body::after`, opacity ~0.035). Sections sit above it; the WebGL canvas
  shows through transparent sections.

### Typography

- **Heading font:** Bricolage Grotesque (`font-heading`) — optical-size `12..96`, weight `400..800`
- **Body font:** Hanken Grotesk (`font-body`) — weights `400;500;600;700`
- **Pairing rationale:** a characterful display grotesque + a clean humanist body grotesque (contrast
  on the humanist↔display axis, not two lookalike geometrics). Max 2 families.
- **Hero/display scale:** fluid `clamp()`, ceiling ≈ 5rem (`text-[clamp(2.75rem,1.2rem+5vw,5rem)]`),
  `tracking-tight`, `text-balance`.

**Google Fonts:**

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Spacing (8px base)

| Token | Value |
|-------|-------|
| `--space-2xs` | `4px` |
| `--space-xs` | `8px` |
| `--space-sm` | `16px` |
| `--space-md` | `24px` |
| `--space-lg` | `32px` |
| `--space-xl` | `48px` |
| `--space-2xl` | `64px` |
| `--space-3xl` | `96px` |

Section rhythm is intentional, not uniform: content sections use `py-24`; the TechStack marquee is a
tighter connective band (`py-16`).

### Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | chips, small controls |
| `--radius-md` | `12px` | inputs, standard cards (`rounded-2xl` on featured surfaces) |
| `--radius-lg` | `20px` | large surfaces |
| `--radius-full` | `9999px` | pills, avatars |

Radius is used for hierarchy: **featured** bento cards are `rounded-3xl`; standard cards `rounded-2xl`.

### Motion

Mirrored in `tokens.css` (ms) and `tokens.js` (seconds, for framer-motion).

| Token | Value |
|-------|-------|
| `--duration-micro` | `80ms` |
| `--duration-short` | `200ms` |
| `--duration-medium` | `350ms` |
| `--duration-long` | `600ms` |
| `--ease-out` (entrances) | `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo) |
| `--ease-in` (exits) | `cubic-bezier(0.7, 0, 0.84, 0)` |
| `--ease-in-out` (moves) | `cubic-bezier(0.65, 0, 0.35, 1)` |

- **Role split:** framer-motion = component reveals/entrances; GSAP = 3D timelines/spin.
- **Shared reveal presets** (`tokens.js`): `reveal` (spread on a standalone block), `revealStagger()`
  + `revealItem` (parent staggers children into one orchestrated reveal). Use these instead of
  re-declaring `initial`/`whileInView` per section.
- **Reduced motion is mandatory:** `<MotionConfig reducedMotion="user">` wraps the app, plus a global
  `@media (prefers-reduced-motion: reduce)` CSS guard for marquees/keyframes. Programmatic
  `scrollIntoView` checks `matchMedia` before using `behavior:'smooth'`.

### Z-index scale

Use the named scale, never arbitrary values.

| Token | Value | Usage |
|-------|-------|-------|
| `--z-canvas` | `-1` | WebGL backdrop |
| `--z-raised` | `10` | in-flow decorative lift (hero floating cards) |
| `--z-overlay` | `50` | sticky nav, mobile sticky CTA |
| `--z-modal` | `60` | modals |
| `--z-toast` | `70` | toasts |

### 3D layer

One shared WebGL context (browsers cap ~16): a single renderer/scene/ortho-camera/RAF. The hero is a
two-tone icosahedron (accent-blue faceted solid + `accent-2` violet wireframe shell) with eased
pointer reactivity. Decorative only (`aria-hidden`); the DOM owns all interaction. Gated on
WebGL support **and** motion allowed **and** viewport ≥ 768px **and** first idle; lazy-loaded so
three.js/GSAP stay out of the entry bundle. Theme colors are read from CSS vars and normalized to
rgb (three.js can't parse `oklch()`).

---

## Component Specs

Components consume tokens via Tailwind semantic utilities. The CSS below uses the token variables
directly (no hardcoded hex) for framework-agnostic reference.

### Buttons

All sizes meet a 44px touch target; sizes differ in text/padding, not hit area.

```css
/* Primary / webgl — gold fill, dark on-accent text (never white) */
.btn-primary {
  background: var(--color-accent-warm);
  color: var(--color-on-accent);
  min-height: 44px;
  padding: 0 1.25rem;
  border-radius: 0.75rem; /* rounded-xl */
  font-weight: 600;
  transition: opacity var(--duration-short) var(--ease-out);
  cursor: pointer;
}
.btn-primary:hover { opacity: 0.9; }

/* Secondary — outlined accent */
.btn-secondary {
  background: transparent;
  color: var(--color-accent);
  border: 2px solid var(--color-accent);
  min-height: 44px;
  padding: 0 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: opacity var(--duration-short) var(--ease-out);
  cursor: pointer;
}
.btn-secondary:hover { background: var(--color-accent-soft); }
```

Every interactive element carries a visible focus ring (`focus-visible:ring-2 ring-ring`).
Transitions stay on `opacity`/`transform` (compositor-friendly) only.

### Cards

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem; /* rounded-2xl; featured surfaces use rounded-3xl */
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  transition: opacity var(--duration-medium) var(--ease-out);
}
.card:hover { box-shadow: var(--shadow-lg); }
```

### Inputs

```css
.input {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 16px; /* >= 16px so mobile Safari doesn't zoom */
  transition: border-color var(--duration-short) var(--ease-out);
}
.input:focus {
  border-color: var(--color-ring);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-ring) 35%, transparent);
}
```

Inputs always have a `<label>`; invalid fields set `aria-invalid` and reference an error via
`aria-describedby`.

### Modals

```css
.modal-overlay {
  background: color-mix(in oklch, black 50%, transparent);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal);
}
.modal {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Dark, maximalist, motion-driven (3D-forward).

**Keywords:** atmosphere/depth, single shared WebGL context, scroll-triggered reveals (one orchestrated
language), bento composition, editorial left-aligned headers, characterful display type.

**Layout patterns in use:**

- **Bento** for Services and Testimonials: a full-width featured card on top (horizontal interior,
  `rounded-3xl`) with two standard cards below — no empty voids.
- **Vertical timeline** for Process (a real ordered sequence, so the step numbers earn their place).
- **Marquee** band for TechStack (dual rows, reduced-motion safe).
- **Floating navbar** spaced from edges; **mobile sticky thumb-zone CTA** (`md:hidden`).

**Section order:** Navbar → Hero → Stats → Services → TechStack → Process → Testimonials → CTA → Footer.

**Conversion strategy:** primary CTA repeated where it earns attention (hero, navbar, mobile sticky bar,
contact section); contact form with inline validation + success empty-state.

---

## Anti-Patterns (Do NOT Use)

- ❌ **Emojis as icons** — use SVG (Lucide / Heroicons).
- ❌ **`text-white` on `accent` / `accent-warm` fills** — use `text-on-accent` (contrast).
- ❌ **Gradient text** (`background-clip: text`) — absolute ban; emphasis via weight/size/`text-accent`.
- ❌ **A tiny uppercase tracked eyebrow above every section** — one deliberate kicker max (currently the CTA).
- ❌ **Fake-clickable `div`s** — use real `<a>`/`<button>` with focus-visible rings.
- ❌ **Layout-shifting hovers / animating layout properties** — animate `transform`/`opacity` only.
- ❌ **Reveal that gates visibility** — content must be visible by default; reveals enhance, never hide
  (transitions pause on hidden tabs/headless renders and would ship a blank section).
- ❌ **Instant state changes** — transitions 150–300ms.
- ❌ **Invisible focus states** — keyboard focus must be visible.

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis as icons (SVG only, consistent set — Lucide)
- [ ] Decorative icons are `aria-hidden`; icon-only controls have an accessible name
- [ ] `cursor-pointer` on all clickable elements
- [ ] Transitions 150–300ms on `transform`/`opacity` only
- [ ] Text contrast ≥ 4.5:1 (dark theme); `text-on-accent` on accent fills
- [ ] 44px minimum touch targets
- [ ] Visible focus states for keyboard navigation
- [ ] `prefers-reduced-motion` respected (framer + CSS + programmatic scroll)
- [ ] Responsive at 375px, 768px, 1024px, 1440px — no horizontal scroll
- [ ] No content hidden behind the floating navbar or mobile sticky CTA
- [ ] All images have `alt`; form inputs have `<label>`
- [ ] Run `coderabbit review --agent` and triage findings before merge
