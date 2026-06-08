# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`manaracode` is a frontend/UI project using `framer-motion` for animations. No framework has been committed yet — when one is chosen, update this file accordingly.

## Pull Request Review (mandatory)

Run the CodeRabbit CLI on every PR before requesting human review or merging.

```bash
coderabbit review --agent     # structured findings for the agent to triage
# or: coderabbit review --plain   for a human-readable pass
```

Workflow for every PR:
1. Open the PR (or have the branch ready vs `main`).
2. Run `coderabbit review --agent`.
3. Triage each finding: fix still-valid issues with minimal diffs, skip the rest with a brief reason.
4. Re-run build + tests, then hand off for merge.

The CLI is installed at `~/.local/bin/coderabbit` (authenticate it locally with your own CodeRabbit account). This is in addition to the GitHub CodeRabbit bot — the CLI catches issues locally before the PR is even pushed. Bot noise is tuned down via `.coderabbit.yaml` (chill profile, incremental reviews).

## Version control & PR workflow (mandatory)

`main` is protected: required checks (Security Scan, Backend (Go), Frontend (Vite)), strict/up-to-date, linear history, conversation-resolution, enforce_admins. Direct pushes to `main` are rejected — every change lands via a PR. Follow this exactly to keep the flow flawless:

1. **Branch from fresh main.** `git checkout main && git pull --ff-only`, then `git checkout -b <type>/<topic>`. One branch = one PR = one merge. **Never reuse a branch after its PR merged** (squash-merge retires it; new commits there never reach main — this is what stranded the Phase 5 work).
2. **Implement + verify locally** (build + tests green; `gofmt`/`go vet` for Go; the impeccable detector for UI).
3. **Run `coderabbit review --agent`** and triage before pushing (see above).
4. **Push, open PR**, let CI run.
5. **Resolve every CodeRabbit bot thread** (fix valid ones, reply-and-resolve the rest via GraphQL `addPullRequestReviewThreadReply` + `resolveReviewThread`) — conversation-resolution gates the merge.
6. **Merge with `gh pr merge <n> --squash --auto --delete-branch`.** Use `--auto` so GitHub merges the instant all gates pass — never poll for a transient `CLEAN` and race the bot (that triggers "base branch policy prohibits the merge"). Do not merge on a stale status read.
7. **After merge, verify it landed:** `git checkout main && git pull`, confirm the squash commit is on `main`, and that the **Deploy** workflow (push to `main`) ran green. A merge that doesn't show on `main` + a Deploy run means something went wrong.
8. **Never `git push origin --delete` a branch manually** (blocked by the safety classifier); `--delete-branch` on merge handles it.

GitHub Actions are pinned to commit SHAs (supply-chain safety) and kept current — the Node-based actions on Node-24 releases (so they don't hit the Node-20 runner deprecation), and the container-based ones (`appleboy/*`, which run in Docker and are Node-agnostic) on their current releases. When bumping an action, resolve the new SHA with `gh api repos/<owner>/<action>/commits/<tag> --jq .sha` and keep the `# vX.Y.Z` comment.

## Deploy & rollback

Push to `main` → the Deploy workflow builds images tagged with both the commit SHA and `:latest`, then deploys the **SHA** (written to `/opt/manaracode/.env` as `IMAGE_TAG`, which `docker-compose.yml` reads). A post-deploy health gate fails the run if the site isn't serving.

**Rollback:** re-run the Deploy workflow via `workflow_dispatch` with `image_tag` set to a previous commit SHA — it skips the build and redeploys that existing image:

```bash
gh workflow run deploy.yml -f image_tag=<previous-commit-sha>
```

Find a known-good SHA from merged PRs / `git log` on `main`. Images live at `ghcr.io/drdeebtech/manaracode-{frontend,backend}:<sha>`.

## Dependencies

- `framer-motion` — animation library (already installed via `npm install`)

## UI/UX Skill

A local `ui-ux-pro-max` skill is installed at `.claude/skills/ui-ux-pro-max/`. Use it before implementing any UI to get data-driven design system recommendations (67 styles, 96 palettes, 57 font pairings, 13 stacks).

**Required first step for any UI work:**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```

**Persist the design system across sessions:**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
# Creates design-system/MASTER.md (global) and optionally design-system/pages/<page>.md (overrides)
```

**Supplemental domain searches:**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain>
# Domains: product, style, typography, color, landing, chart, ux, react, web
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack <stack>
# Stacks: html-tailwind (default), react, nextjs, vue, svelte, shadcn, swiftui, react-native, flutter, jetpack-compose
```

**Hierarchical design system retrieval:** When building a specific page, check `design-system/pages/<page>.md` first; its rules override `design-system/MASTER.md`.

**Active design system (read before UI work):** `design-system/manaracode/MASTER.md` is the committed source of truth for this project (dark, motion-driven dev-studio system).

## Pre-Delivery UI Checklist

Before delivering any UI code:

- No emojis as icons — use SVG (Heroicons, Lucide)
- All clickable elements have `cursor-pointer`
- Transitions 150–300ms on compositor-friendly properties (`transform`, `opacity`) only
- Light mode: text contrast ≥ 4.5:1, glass/transparent elements visible, borders visible
- Floating navbar spaced from edges (`top-4 left-4 right-4`)
- Responsive at 375px, 768px, 1024px, 1440px — no horizontal scroll
- `prefers-reduced-motion` respected
- All images have `alt` text; form inputs have `<label>`

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
