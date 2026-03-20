# CLAUDE.md

**WeHire** — Branded recruitment microsite platform for small businesses in Indonesia.
Stack: Next.js 15 App Router + React 19 · Google Sheets (via Apps Script) · Tailwind CSS + shadcn/ui · Vitest

## Dev Commands
`npm run dev|build|lint|test`

> No DB commands for MVP — data storage uses Google Sheets via Apps Script.

## Features
`src/features/{auth,[feature-a],[feature-b],...}` · `src/shared/{domain,presentation,core,di}` · `src/lib/` · `src/app/`

## Workflow
Before any work: `/create-issue [title]` → wait for instruction → invoke agent

## Issue rule
On `fix/`|`feature/` branch → add feedback to current issue. On `main` → create new issue.

Issues live in GitHub — use `gh issue view <n>` for context. `issues/000-backlog.md` is a quick-reference index only; no local `.md` files per issue.

## Project-specific agent rules
`.claude/agents.local/` — additive rules on top of the shared starter-kit agents.

<!-- Shared arch docs, skills, workflow, and code principles → .claude/starter-kit/ -->
