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
