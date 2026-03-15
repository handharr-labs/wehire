# 001 · Implement Google Apps Script backend for career microsite data and form submission

**Phase:** MVP
**Status:** `pending`
**GitHub:** [#1](https://github.com/handharr-labs/wehire/issues/1)

---

## Goal
Implement the Google Apps Script web app that serves as the backend for the WeHire career microsite. The frontend already sends requests to `NEXT_PUBLIC_APPS_SCRIPT_URL` but the script itself does not exist.

---

## Changes
- New `Code.gs` (or equivalent) Apps Script file with a `doGet` handler routing `action` params: `getCompany`, `getJobs`, `getJob`
- `doPost` handler that receives multipart/form-data, uploads CV to Google Drive, appends a Candidates sheet row
- Structured JSON responses matching frontend DTOs (`CompanyDto`, `JobDto`, `ApplicationPayload`)
- Error logging to a `Form_Logs` sheet

---

## Acceptance Criteria
- [ ] GET handler returns company info from Google Sheets for a given slug
- [ ] GET handler returns job list for a company slug
- [ ] GET handler returns single job detail by jobId
- [ ] POST handler receives multipart/form-data application submission
- [ ] POST handler uploads CV file to Google Drive
- [ ] POST handler appends a row to the Candidates sheet
- [ ] POST handler returns structured JSON matching frontend DTOs
- [ ] Errors are logged to Form_Logs sheet
- [ ] Responses match the shape expected by AppsScriptDataSource
