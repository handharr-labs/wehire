# CLAUDE.md

**WeHire** — Branded recruitment microsite platform for small businesses in Indonesia.
Stack: Next.js 15 App Router + React 19 · Google Sheets (via Apps Script) · N/A · None (MVP) · Tailwind CSS + shadcn/ui · Vitest

## Dev Commands
```bash
npm run dev | build | lint | test
```

> No DB commands for MVP — data storage uses Google Sheets via Apps Script.

## Structure
Feature slices: `src/features/{auth,[feature-a],[feature-b],...}` · `src/shared/{domain,presentation,core,di}` · `src/lib/` · `src/app/`
Arch docs: `.claude/nextjs-arch/` · DI/arch rules: `.claude/docs/`

## Workflow
Before any work: `/create-issue [title]` → wait for instruction → invoke agent

Agents: `feature-scaffolder` · `backend-scaffolder` · `debug-agent` · `test-writer` · `arch-reviewer` · `/simplify` · `.claude/skills/`

Issue rule: On `fix/`|`feature/` branch → add feedback to current issue. On `main` → create new issue.

## Code Principles
CLEAN · DRY · SOLID (SRP, OCP, LSP, ISP, DIP). Wire deps via `src/shared/di/`.
