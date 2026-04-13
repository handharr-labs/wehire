# CLAUDE.md

**WeHire** — Branded recruitment microsite platform for small businesses in Indonesia.
Stack: Next.js 15 App Router + React 19 · Google Sheets (via Apps Script) · Tailwind CSS + shadcn/ui · Vitest

## Dev Commands
`npm run dev|build|lint|test`

> No DB commands for MVP — data storage uses Google Sheets via Apps Script.

## Features
`src/features/{auth,[feature-a],[feature-b],...}` · `src/shared/{domain,presentation,core,di}` · `src/lib/` · `src/app/`

## Project-specific agent rules
`.claude/agents.local/` — additive rules on top of the shared starter-kit agents.

## Naming conventions
`use*ViewModel` — React hooks (stateful, client-only).
`build*ViewModel` — pure transform functions (no hooks, no side effects). The `build*` prefix intentionally deviates from the `use*` hook convention because these are not React hooks.

Issues live in GitHub — use `gh issue view <n>` for context. `issues/000-backlog.md` is a quick-reference index only; no local `.md` files per issue.

<!-- BEGIN web-agentic -->
## Workflow
Before any work, invoke the **issue-worker** agent with a title (new) or number (existing).

```
issue-worker "add X"   → create GH issue + branch + backlog row
issue-worker 42        → pick up existing GH issue + branch + backlog row
```

Agents: `feature-orchestrator` · `backend-orchestrator` · `debug-worker` · `test-worker` · `arch-review-worker` · `/simplify` · `.claude/skills/`

**Feature work (create or update, any scope) → always delegate to `feature-orchestrator`, never inline.**

Issue rule: On `fix/`|`feat/` branch → add feedback to current issue. On `main` → create new issue.

## Code Principles
CLEAN · DRY · SOLID (SRP, OCP, LSP, ISP, DIP). Wire deps via `src/shared/di/`.
<!-- END web-agentic -->
