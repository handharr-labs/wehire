# 008 · Enforce plan job limit and surface 'not hiring' state on career page

**Phase:** MVP
**Status:** `pending`
**GitHub:** [#8](https://github.com/handharr-labs/wehire/issues/8)

---

## Goal
Enforce the `maxActiveJobs` plan limit so the career page gracefully shows a "not hiring right now" state when the company has reached its active job cap.

---

## Changes
- `GetJobsUseCase` or a domain rule: compare active job count vs `maxActiveJobs`
- Career page: render "not currently hiring" UI state when limit is reached or no active jobs exist
- Apps Script backend (Issue #1): return a flag or empty jobs array when limit is hit

---

## Acceptance Criteria
- [ ] Career page detects when active job count equals maxActiveJobs
- [ ] A 'not currently hiring' UI state is shown when no active jobs are available due to limit
- [ ] Domain rule or use case check validates active job count vs maxActiveJobs
- [ ] Backend enforcement (Apps Script) returns appropriate signal when limit is reached
- [ ] Front-end surfaces the limit state without exposing internal plan details
