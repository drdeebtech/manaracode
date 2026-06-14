# Security Policy

## Supported versions

`manaracode` is a continuously deployed application. Only the latest commit on
`main` (the version currently deployed to production) is supported and receives
security fixes. There are no long-lived release branches.

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Report privately via GitHub's security advisories:

1. Go to the [Security advisories page](https://github.com/drdeebtech/manaracode/security/advisories/new).
2. Provide a clear description, reproduction steps, and the potential impact.

If you cannot use GitHub advisories, contact the maintainers at
**contact@manaracode.com**.

We aim to acknowledge reports within **72 hours** and to provide a remediation
timeline after triage. Please give us a reasonable window to ship a fix before
any public disclosure.

## Scope

In scope:

- The production site (manaracode.com) and its public endpoints (e.g. the
  contact form).
- The application code in this repository (`frontend/`, `backend/`,
  `infrastructure/`).

Out of scope:

- Findings that require physical access, social engineering, or a compromised
  user device.
- Volumetric denial-of-service testing against production.
- Reports from automated scanners without a demonstrated, exploitable impact.

## Our security practices

- **Branch protection** on `main`: required status checks (Security Scan,
  Backend, Frontend), strict up-to-date merges, linear history, and required
  conversation resolution.
- **CI security scanning** runs on every change (see `.github/workflows/`).
- **Dependency updates** are automated via Dependabot
  (`.github/dependabot.yml`).
- **Pinned GitHub Actions** to commit SHAs to reduce supply-chain risk.
- **Public unauthenticated endpoints** (contact form) are protected with
  server-side bot defense, per-IP rate limiting, and strict input validation.
- **Secrets** are never committed; they live in environment variables / secret
  managers and are restricted with least privilege.

Thank you for helping keep manaracode and its users safe.
