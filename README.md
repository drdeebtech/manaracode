# manaracode

The website behind [manaracode.com](https://manaracode.com) — a software studio
building production web, mobile, and cloud platforms, founded and led by a
practising physician with deep experience in healthcare software.

This repository is published **publicly as a portfolio**, so the engineering
behind the site is open to read. It is **not** open source — see
[Viewing only](#viewing-only-not-open-source) below.

## What's here

A small, production-grade full-stack app, deployed and live:

- **Frontend** — React + Vite SPA with a dark, motion-driven design system
  (framer-motion), a token-based theme, accessible components, and a WebGL hero
  layer. Multi-page (`/`, `/about`, `/work`, `/privacy`, `/terms`) with
  build-time per-route SEO prerendering.
- **Backend** — a small Go service for the contact form: parameterized SQLite,
  SMTP notifications (Amazon SES), Cloudflare Turnstile bot defense, per-IP rate
  limiting with trusted-proxy client-IP handling, and sanitized email headers.
- **Infrastructure** — AWS CDK (TypeScript): EC2 origin, S3 contact-DB backups,
  budgets, monitoring, and SSM access, behind Cloudflare (origin-locked, SSL
  Full (strict), WAF, bot protection).
- **CI/CD** — GitHub Actions pinned to commit SHAs, secret scanning (gitleaks),
  dependency CVE gates (govulncheck, npm audit), tests, and a health-gated
  deploy with SHA-pinned rollback.

## Tech

`React` · `Vite` · `framer-motion` · `Three.js` · `Go` · `SQLite` ·
`AWS CDK` · `Docker` · `nginx` · `Cloudflare` · `GitHub Actions`

## Viewing only (not open source)

This code is shared so you can **see how it's built** — nothing more. You are
welcome to read it. You may **not** copy, modify, reuse, or redistribute it.
All rights are reserved. See [`LICENSE`](./LICENSE) for the full terms.

Because the repository is public, GitHub still allows viewing and forking at the
platform level; that does not grant any right to use the code. For any use
beyond reading, please ask first: **contact@manaracode.com**.

Issues and pull requests are not accepted — see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

© 2026 manaracode. All rights reserved.
