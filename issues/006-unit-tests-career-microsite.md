# 006 · Write unit and ViewModel hook tests for career-microsite feature

**Phase:** MVP
**Status:** `pending`
**GitHub:** [#6](https://github.com/handharr-labs/wehire/issues/6)

---

## Goal
Add the initial test suite for the career-microsite feature covering domain mappers, use cases, and ViewModel hooks. Zero tests currently exist.

---

## Changes
- Mapper tests: `CompanyMapper.test.ts`, `JobMapper.test.ts`
- Use case tests: `GetCompanyBySlugUseCase.test.ts`, `GetJobsUseCase.test.ts`, `GetJobDetailUseCase.test.ts`, `SubmitApplicationUseCase.test.ts`
- ViewModel hook tests: `useCareerPageViewModel.test.ts`, `useJobDetailViewModel.test.ts`, `useApplyFormViewModel.test.ts`

---

## Acceptance Criteria
- [ ] Unit tests for CompanyMapper (DTO → entity transform)
- [ ] Unit tests for JobMapper (DTO → entity transform)
- [ ] Unit tests for GetCompanyBySlugUseCase
- [ ] Unit tests for GetJobsUseCase
- [ ] Unit tests for GetJobDetailUseCase
- [ ] Unit tests for SubmitApplicationUseCase
- [ ] ViewModel hook tests for useCareerPageViewModel
- [ ] ViewModel hook tests for useJobDetailViewModel
- [ ] ViewModel hook tests for useApplyFormViewModel
- [ ] All tests pass with npm run test
