# 002 · Add CV file size client-side validation to application form

**Phase:** MVP
**Status:** `pending`
**GitHub:** [#2](https://github.com/handharr-labs/wehire/issues/2)

---

## Goal
Add client-side file size validation (max 2–3 MB) to the CV upload field in the apply form before the network request is made.

---

## Changes
- `useApplyFormViewModel`: add `FileList` size check before `SubmitApplicationUseCase` is called
- Inline error message when file exceeds the limit
- Error state clearable when user selects a new valid file

---

## Acceptance Criteria
- [ ] FileList size check added in useApplyFormViewModel before submission
- [ ] Error message displayed inline when file exceeds the limit
- [ ] Accepted file types (.pdf, .doc, .docx) remain enforced
- [ ] Validation fires before the network request is made
- [ ] Error state is clearable when user selects a new valid file
