# Changelog

All notable changes to WeHire are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Versioning follows [Semantic Versioning](https://semver.org/).

---

## [2.1.0] — 2026-04-10

### Added
- **Rule-based applicant scoring** — automated scoring of job applicants based on configurable criteria ([#26](https://github.com/handharr-labs/wehire/issues/26))
  - `ApplicantScoringService` — domain service implementing scoring logic across entities
  - Scoring fields extended across DTOs, mappers, and repositories in the data layer
  - Scoring integrated into apply form and company settings in the presentation layer
  - Apps Script backend auto-adds missing scoring columns and handles new fields
  - Unit tests for scoring logic and updated fixtures for new entity fields

---

## [2.0.0] - 2026-04-10

### Changed
- **Marketing landing page** — full revamp with Miro design system ([#50](https://github.com/handharr-labs/wehire/issues/50))
- **Career microsite** — redesigned career page and job detail screens ([#50](https://github.com/handharr-labs/wehire/issues/50))
- **Career page header** — improved header design ([#50](https://github.com/handharr-labs/wehire/issues/50))

---

## [1.1.0] - 2026-03-19

### Added
- **Client onboarding wizard** at `/admin/onboarding` — 4-step guided setup for new `COMPANY_ADMIN` users ([#25](https://github.com/handharr-labs/wehire/issues/25))
  - Step 1: Company profile form (name, slug, logo, brand colors, contact email, WhatsApp)
  - Step 2: Google Drive setup checklist (manual folder/sheet creation guide)
  - Step 3: Connection verification via Apps Script ping (`GET ?action=getCompany&slug`)
  - Step 4: Launch — activates career page (`site_status → active`) and redirects to `/admin/jobs`
- `VerifyCompanyConnectionUseCase` — domain use case for Drive structure verification
- Server actions: `saveOnboardingProfileAction`, `verifyCompanyConnectionAction`, `launchCompanyAction`

### Changed
- Onboarding page skips wizard and redirects to `/admin/jobs` if company is already active
- `SUPER_ADMIN` redirected to `/admin/dashboard` when visiting `/admin/onboarding`

---

## [1.0.0] - 2026-03-19

### Added
- **Admin authentication** — JWT session-based login/logout for `SUPER_ADMIN` and `COMPANY_ADMIN` roles ([#22](https://github.com/handharr-labs/wehire/issues/22))
- **Company settings admin panel** — update name, slug, logo, brand colors, contact info, and site status ([#23](https://github.com/handharr-labs/wehire/issues/23))
- **Job management CRUD for admin** — create, edit, delete jobs with Zod-validated form; role-aware routing for multi-company ([#24](https://github.com/handharr-labs/wehire/issues/24))
- **Multi-tenant Apps Script backend** — per-company Drive folder (`{slug}-dir`) and spreadsheet (`{slug}-database`) with `Jobs`, `Candidates`, `Form_Logs` tabs ([#27](https://github.com/handharr-labs/wehire/issues/27))
- **Career microsite** — branded public career pages at `/{slug}` with job listings and application form ([#1](https://github.com/handharr-labs/wehire/issues/1))
- **Subdomain routing middleware** — maps subdomains to branded career pages ([#7](https://github.com/handharr-labs/wehire/issues/7))
- **Brand color theming** — dynamic CSS variables from company settings applied across all career page views ([#3](https://github.com/handharr-labs/wehire/issues/3))
- **Application form validation** — Zod schema validation ([#5](https://github.com/handharr-labs/wehire/issues/5)), CV file size limit (5 MB) ([#2](https://github.com/handharr-labs/wehire/issues/2))
- **Job guard** — apply form blocked for inactive or expired jobs ([#4](https://github.com/handharr-labs/wehire/issues/4))
- **Plan job limit** — enforces max active jobs per company plan; surfaces "not hiring" state on career page ([#8](https://github.com/handharr-labs/wehire/issues/8))
- **Marketing landing page** at `/` ([#9](https://github.com/handharr-labs/wehire/issues/9))
- **Environment variable documentation** and `.env.example` ([#10](https://github.com/handharr-labs/wehire/issues/10))
- Unit and ViewModel hook tests for career-microsite feature ([#6](https://github.com/handharr-labs/wehire/issues/6))

---

[2.0.0]: https://github.com/handharr-labs/wehire/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/handharr-labs/wehire/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/handharr-labs/wehire/releases/tag/v1.0.0
