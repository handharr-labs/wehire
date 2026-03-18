---
name: create-issue
description: Create a GitHub Issue, a local issue file in issues/, and a matching git branch. Use when asked to create, track, or log a new issue or task.
disable-model-invocation: true
context: fork
allowed-tools: Bash, Write, Edit, Read
---

Create a new issue for this project from $ARGUMENTS.

Steps:

1. **Create GitHub Issue**
   Run: `gh issue create --title "$ARGUMENTS" --body "## Goal
[Fill in after scaffolding]

## Acceptance Criteria
- [ ] TBD

## Notes
"`
   Capture the returned issue number from the printed URL (last path segment).

2. **Use GitHub issue number** as the canonical issue number. Zero-pad to 3 digits → `NNN`.

3. **Determine type** from the description:
   - Bug/fix → `fix`, branch prefix `fix/`
   - Feature/new → `feat`, branch prefix `feat/`
   - Chore/cleanup → `chore`, branch prefix `chore/`
   - Docs → `docs`, branch prefix `docs/`

4. **Create issue file** at `issues/NNN-slug.md`
   Use kebab-case slug from the title. Template:

   ```
   # NNN · Title

   **Phase:** [infer from context, default: TBD]
   **Status:** `pending`
   **GitHub:** [#NNN](url)

   ---

   ## Goal
   [What this accomplishes — infer from $ARGUMENTS]

   ---

   ## Changes
   [Key changes needed — infer or leave as TBD]

   ---

   ## Acceptance Criteria
   - [ ] ...
   ```

5. **Create git branch**
   Run: `git checkout -b [type]/issue-NNN-slug`
   Example: `feat/issue-022-receipt-scanning`

6. **Update backlog**
   Add a row to the appropriate phase table in `issues/000-backlog.md`:
   `| NNN | Title | \`pending\` | [NNN-slug.md](./NNN-slug.md) |`
   If unsure which phase, add under the "## Inbox" section at the bottom.

7. **Confirm** — show the user:
   - GitHub Issue created: title + URL
   - Issue file created: `issues/NNN-slug.md`
   - Branch created: `[type]/issue-NNN-slug`
   - Backlog updated

> **PR reminder:** when opening a PR for this issue, put `Closes #NNN` as the **first line** of the PR body so GitHub auto-closes the issue on merge.
