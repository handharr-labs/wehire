# 004 · Guard apply form against inactive or expired jobs

**Phase:** MVP
**Status:** `pending`
**GitHub:** [#4](https://github.com/handharr-labs/wehire/issues/4)

---

## Goal
Prevent applications from being submitted for jobs that are inactive or past their expiry date, both in the UI and the use case layer.

---

## Changes
- `SubmitApplicationUseCase`: check job `status === 'active'` and `expiredAt > now()` before submitting; throw `DomainError` otherwise
- Job detail view: hide/disable Apply button when job is not active or expired
- Career page job list: visually mark or hide expired/inactive jobs

---

## Acceptance Criteria
- [ ] Apply button is hidden/disabled when job status is not 'active'
- [ ] Apply button is hidden/disabled when job expiredAt is in the past
- [ ] Attempting to submit via the form route returns a clear error state
- [ ] Career page job list visually marks or hides expired/inactive jobs
- [ ] Guard is applied in both the UI layer and the SubmitApplicationUseCase
