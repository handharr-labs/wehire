# 010 · Document environment variable setup and create .env.example

**Phase:** MVP
**Status:** `pending`
**GitHub:** [#10](https://github.com/handharr-labs/wehire/issues/10)

---

## Goal
Create a `.env.example` file and document all required environment variables so developers can set up the project without guessing.

---

## Changes
- `.env.example` at project root with all required vars and inline comments
- `.gitignore`: confirm `.env.local` is excluded (add if missing)
- Brief setup note in `CLAUDE.md` or `README.md` pointing to `.env.example`

---

## Acceptance Criteria
- [ ] .env.example created at project root with all required env vars
- [ ] NEXT_PUBLIC_APPS_SCRIPT_URL documented with description
- [ ] Instructions for obtaining the Apps Script deployment URL included
- [ ] .env.local added to .gitignore (if not already)
- [ ] Setup steps referenced from README or CLAUDE.md
