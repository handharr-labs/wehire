---
name: pickup-issue
description: Pick up a GitHub Issue created by the PM. Fetches issue data, checks out a matching branch, and updates the backlog.
context: fork
allowed-tools: Bash, Edit, Read
---

Pick up GitHub Issue #$ARGUMENTS for local development.

Steps:

1. **Fetch GitHub Issue data**
   Run: `gh issue view $ARGUMENTS --json number,title,body,url`
   Extract: `number`, `title`, `body`, `url`.

2. **Determine type** from the title:
   - Bug/fix → `fix`, branch prefix `fix/`
   - Feature/new → `feat`, branch prefix `feat/`
   - Chore/cleanup → `chore`, branch prefix `chore/`
   - Docs → `docs`, branch prefix `docs/`

3. **Derive local identifiers**
   - Zero-pad the issue number to 3 digits → `NNN` (e.g. `35` → `035`)
   - Build a kebab-case slug from the title (lowercase, spaces→dashes, strip special chars)

4. **Create git branch**
   Run: `git checkout -b [type]/issue-NNN-slug`
   Example: `feat/issue-035-add-export-button`

5. **Update backlog**
   Add a row to the "## Inbox" section in `issues/000-backlog.md`:
   `| NNN | Title | \`pending\` | [#NNN](url) |`
   Create the "## Inbox" section if it doesn't exist.

6. **Confirm** — show the user:
   - GitHub Issue fetched: title + URL
   - Branch created: `[type]/issue-NNN-slug`
   - Suggested next step: invoke `feature-scaffolder` or `debug-agent` depending on issue type

> **PR reminder:** when opening a PR for this issue, put `Closes #NNN` as the **first line** of the PR body so GitHub auto-closes the issue on merge.
