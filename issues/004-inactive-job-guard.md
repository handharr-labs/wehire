---
id: 004
title: Guard apply form against inactive or expired jobs
status: in-progress
branch: feat/issue-004-inactive-job-guard
---

## Problem
Jobs have `status: 'active' | 'closed' | 'draft'` and `expiredAt: string` fields, but no guard exists anywhere — inactive/expired jobs are still visible, linkable, and submittable.

## Solution
- Domain helper `isJobOpen` encapsulates the guard logic
- `SubmitApplicationUseCaseImpl` re-checks job status at submit time (race-condition guard)
- Apply page server route redirects to job detail for inactive jobs
- Career page listing filters out non-open jobs
- Job detail page hides "Apply Now" button for inactive jobs
- ViewModel surfaces a human-readable error message if the use case rejects

## Acceptance Criteria
- [ ] Closed/draft/expired jobs do not appear in the career page listing
- [ ] Direct URL to `/[slug]/jobs/[jobId]/apply` for a closed job redirects to job detail
- [ ] "Apply Now" button is hidden on job detail page for inactive jobs
- [ ] Submitting to a closed job (race condition) shows "This position is no longer accepting applications."
- [ ] `npm run build` and `npm run lint` pass
