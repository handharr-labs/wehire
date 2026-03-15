# WeHire — Google Apps Script Backend

This directory contains the entire backend for WeHire: a single Apps Script file (`Code.gs`) that reads/writes a Google Sheet and uploads CV files to Google Drive.

---

## 1. Google Sheet Setup

Create a Google Sheet with **four tabs** named exactly as shown below (case-sensitive).

### Sheet: `Companies`
| Column | Header | Type |
|--------|--------|------|
| A | id | string |
| B | name | string |
| C | slug | string (URL-safe, e.g. `acme-corp`) |
| D | logo_url | string (public image URL) |
| E | primary_color | string (hex, e.g. `#1A73E8`) |
| F | secondary_color | string (hex) |
| G | description | string |
| H | contact_email | string |
| I | whatsapp_number | string (e.g. `628123456789`) |
| J | site_status | string (`active` / `inactive`) |
| K | max_active_jobs | number |

### Sheet: `Jobs`
| Column | Header | Type |
|--------|--------|------|
| A | id | string |
| B | company_id | string (matches Companies.id) |
| C | title | string |
| D | department | string |
| E | location | string |
| F | employment_type | string (`full_time` / `part_time` / `contract` / `internship`) |
| G | min_salary | number |
| H | max_salary | number |
| I | description | string (plain text or markdown) |
| J | requirements | string (plain text or markdown) |
| K | status | string (`open` / `closed`) |
| L | expired_at | string (ISO 8601, e.g. `2026-12-31T00:00:00Z`) |
| M | sort_order | number (lower = higher on listing) |

### Sheet: `Candidates`
| Column | Header | Notes |
|--------|--------|-------|
| A | timestamp | Written by script |
| B | job_id | |
| C | company_id | |
| D | full_name | |
| E | email | |
| F | phone | |
| G | city | |
| H | experience_summary | |
| I | expected_salary | |
| J | cv_url | Google Drive shareable link |
| K | linkedin_url | Optional |
| L | portfolio_url | Optional |
| M | cover_letter | Optional |

### Sheet: `Form_Logs`
| Column | Header |
|--------|--------|
| A | timestamp |
| B | action |
| C | error |

---

## 2. Create the Apps Script Project

**Option A — Standalone project (recommended for MVP)**

1. Go to [script.google.com](https://script.google.com) → **New project**.
2. Delete the default `myFunction` code.
3. Paste the contents of `Code.gs` into the editor.
4. Save the project (name it e.g. `WeHire Backend`).

**Option B — Bound to the Sheet**

1. In your Google Sheet, go to **Extensions → Apps Script**.
2. Replace all code with the contents of `Code.gs`.
3. Save.

> For Option A you must set `SPREADSHEET_ID` in Script Properties (see step 4).
> For Option B, you can replace `SpreadsheetApp.openById(SPREADSHEET_ID)` with `SpreadsheetApp.getActiveSpreadsheet()` if you prefer — but using the property keeps the code portable.

---

## 3. Set Script Properties

In the Apps Script editor:

1. Click the gear icon → **Project Settings** → scroll to **Script Properties**.
2. Add the following properties:

| Property | Value |
|----------|-------|
| `SPREADSHEET_ID` | The ID from your Google Sheet URL (`/d/<ID>/edit`) |
| `CV_FOLDER_ID` | The ID of a Google Drive folder where CVs will be uploaded |

To get a Drive folder ID: open the folder in Drive → copy the last segment of the URL (`/folders/<ID>`).

Make the CV folder's general access **"Anyone with the link — Viewer"** so that CV links work for the hiring team without authentication issues.

---

## 4. Deploy as Web App

1. In the Apps Script editor click **Deploy → New deployment**.
2. Click the gear next to **Select type** → choose **Web app**.
3. Set:
   - **Description**: `v1` (or any label)
   - **Execute as**: `Me` (your Google account)
   - **Who has access**: `Anyone`
4. Click **Deploy** → authorise the required permissions.
5. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/<ID>/exec`).

> Every time you update `Code.gs` you must create a **new deployment** (or redeploy the existing one). The URL stays the same if you update an existing deployment.

---

## 5. Configure the Next.js App

Add the URL to `.env.local` at the project root:

```env
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/<YOUR_DEPLOYMENT_ID>/exec
```

Restart the dev server:

```bash
npm run dev
```

---

## 6. Verify End-to-End

1. **Company page loads** — navigate to `http://localhost:3000/{slug}`. The page should show the company name and job listings fetched from the `Companies` and `Jobs` sheets.

2. **Job detail loads** — click a job listing. The detail page fetches `?action=getJob&jobId=X`.

3. **Application submission** — fill and submit the application form on a job detail page. Check:
   - A new row appears in the `Candidates` sheet.
   - The `cv_url` column contains a valid Google Drive link.

4. **Error logging** — use an invalid slug (e.g. `/nonexistent-company`). Check the `Form_Logs` sheet for a new error row.

---

## API Reference

| Method | Parameters | Response |
|--------|-----------|----------|
| `GET ?action=getCompany&slug=X` | `slug` — company URL slug | `{ data: CompanyDTO }` |
| `GET ?action=getJobs&companyId=X` | `companyId` — company ID | `{ data: JobDTO[] }` |
| `GET ?action=getJob&jobId=X` | `jobId` — job ID | `{ data: JobDTO }` |
| `POST` (multipart/form-data) | See `ApplicationPayload` fields | `{ success: true }` or `{ error: "..." }` |

All error responses have the shape `{ error: "message" }`. Check the `Form_Logs` sheet for full error context.
