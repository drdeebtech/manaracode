<!-- Keep PRs focused: one branch = one PR = one merge. -->

## Summary

<!-- What changed and why. Link the issue if there is one (Closes #123). -->

## Type of change

- [ ] feat — new functionality
- [ ] fix — bug fix
- [ ] refactor — no behavior change
- [ ] docs / chore / ci
- [ ] perf / test

## Test plan

<!-- How you verified this. Commands run, screenshots for UI. -->

- [ ] `frontend`: build + tests green (Vite)
- [ ] `backend`: `gofmt`, `go vet`, tests green (Go)
- [ ] UI changes reviewed against the Pre-Delivery UI Checklist (CLAUDE.md)

## Checklist

- [ ] Branched from fresh `main`; linear history
- [ ] `coderabbit review --agent` run and findings triaged
- [ ] No secrets, credentials, or `.env` files committed
- [ ] Input validated at system boundaries where applicable
- [ ] CI checks pass (Security Scan, Backend (Go), Lint (ESLint), Frontend (Vite))
