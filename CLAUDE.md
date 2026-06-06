# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`manaracode` is a frontend/UI project using `framer-motion` for animations. No framework has been committed yet — when one is chosen, update this file accordingly.

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

## GBrain Configuration (configured by /setup-gbrain)
- Mode: local-stdio
- Engine: pglite
- Config file: ~/.gbrain/config.json (mode 0600)
- Setup date: 2026-06-06
- MCP registered: yes (user scope)
- Artifacts sync: full to https://github.com/drdeebtech/gstack-artifacts-drdeeb
- Current repo policy: read-write

## GBrain Search Guidance (configured by /sync-gbrain)
<!-- gstack-gbrain-search-guidance:start -->

GBrain is set up and synced on this machine. The agent should prefer gbrain
over Grep when the question is semantic or when you don't know the exact
identifier yet.

**This worktree is pinned to a worktree-scoped code source** via the
`.gbrain-source` file in the repo root (kubectl-style context). Any
`gbrain code-def`, `code-refs`, `code-callers`, `code-callees`, or `query`
call from anywhere under this worktree routes to that source by default —
no `--source` flag needed. Conductor sibling worktrees of the same repo
each have their own pin and their own indexed pages, so semantic results
match the actual code on disk in this worktree.

Two indexed corpora available via the `gbrain` CLI:
- This worktree's code (auto-pinned via `.gbrain-source`).
- `~/.gstack/` curated memory (registered as `gstack-brain-drdeeb` source via
  the existing federation pipeline).

Prefer gbrain when:
- "Where is X handled?" / semantic intent, no exact string yet:
    `gbrain search "<terms>"` or `gbrain query "<question>"`
- "Where is symbol Y defined?" / symbol-based code questions:
    `gbrain code-def <symbol>` or `gbrain code-refs <symbol>`
- "What calls Y?" / "What does Y depend on?":
    `gbrain code-callers <symbol>` / `gbrain code-callees <symbol>`
- "What did we decide last time?" / past plans, retros, learnings:
    `gbrain search "<terms>" --source gstack-brain-drdeeb`

Grep is still right for known exact strings, regex, multiline patterns, and
file globs. Run `/sync-gbrain` after meaningful code changes; for ongoing
auto-sync across all worktrees, run `gbrain autopilot --install` once per
machine — gbrain's daemon handles incremental refresh on a schedule.

Safety: don't run `/sync-gbrain` while `gbrain autopilot` is active — the
orchestrator refuses destructive source ops when it detects a running autopilot
to avoid racing it (#1734). Prefer registering user repos with `gbrain sources
add --path <dir>` (no `--url`): URL-managed sources can auto-reclone, and the
sync code walk for them requires an explicit `--allow-reclone` opt-in.

<!-- gstack-gbrain-search-guidance:end -->
