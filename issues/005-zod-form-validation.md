# 005 · Add Zod schema validation to application form fields

**Phase:** MVP
**Status:** `pending`
**GitHub:** [#5](https://github.com/handharr-labs/wehire/issues/5)

---

## Goal
Replace HTML-only `required` attributes with a Zod schema that validates all `ApplicationPayload` fields client-side, surfacing inline errors before submission.

---

## Changes
- Define `applicationSchema` (Zod) covering all `ApplicationPayload` fields
- Integrate schema into `useApplyFormViewModel` (validate on submit, expose field-level errors)
- Display validation errors as inline messages in the form view
- CV file validation: type + size ≤ 3 MB (supersedes Issue #2 file-size check if done together)

---

## Acceptance Criteria
- [ ] Zod schema defined for all ApplicationPayload fields
- [ ] Email format validated (valid RFC email)
- [ ] Phone format validated (numeric, reasonable length)
- [ ] Salary validated as number > 0
- [ ] URL fields (linkedin, portfolio) validated as valid URLs if provided
- [ ] CV file validated: correct type and size ≤ 3 MB
- [ ] Validation errors surface as inline field-level messages in the form
- [ ] Schema reused/imported in useApplyFormViewModel
