# WeHire — Google Apps Script Backend

This directory contains the entire backend for WeHire: a single Apps Script file (`Code.gs`) that reads/writes Google Sheets and uploads CV files to Google Drive.

The backend uses a **multi-tenant per-company structure**: one global `companies_database` spreadsheet holds company registry data, while each company has its own dedicated spreadsheet and CV folder.

### Repository layout

```
apps-script/
├── Code.gs                        ← single deployed Apps Script
└── sheets/
    ├── global/
    │   └── Companies.csv          ← global registry (all companies)
    ├── test-company/              ← test-company-database seed data
    │   ├── Jobs.csv
    │   ├── Candidates.csv
    │   └── Form_Logs.csv
    ├── nusantara-tech/
    │   ├── Jobs.csv
    │   ├── Candidates.csv
    │   └── Form_Logs.csv
    ├── kreasi-digital/
    │   ├── Jobs.csv
    │   ├── Candidates.csv
    │   └── Form_Logs.csv
    └── logistik-cepat/
        ├── Jobs.csv
        ├── Candidates.csv
        └── Form_Logs.csv
```

Each subdirectory under `sheets/` mirrors one company's Google Sheet. When adding a new company, add its seed CSV folder here alongside the corresponding row in `global/Companies.csv`.

---

## 1. Overview

| Spreadsheet | Purpose |
|-------------|---------|
| `companies_database` (global) | Registry of all companies: branding, config, and pointers to per-company spreadsheets |
| `[company]-database` (per-company) | Jobs, Candidates, and Form_Logs for that company only |

Each company's CV files are stored in a dedicated Drive folder (`CVs/`) inside that company's directory.

---

## 2. Drive Folder Structure

```
My Drive/
├── global/
│   └── companies_database          ← Companies sheet (global registry)
├── test-company-dir/
│   ├── test-company-database       ← Jobs, Candidates, Form_Logs
│   └── CVs/                        ← CV uploads for test-company
└── another-company-dir/
    ├── another-company-database
    └── CVs/
```

---

## 3. Google Sheet Schemas

### Global sheet: `companies_database`

One tab named **`Companies`**:

| Column | Header | Type | Notes |
|--------|--------|------|-------|
| A | id | string | Unique company ID |
| B | name | string | Display name |
| C | slug | string | URL-safe slug (e.g. `acme-corp`) |
| D | logo_url | string | Public image URL |
| E | primary_color | string | Hex (e.g. `#1A73E8`) |
| F | secondary_color | string | Hex |
| G | description | string | |
| H | contact_email | string | |
| I | whatsapp_number | string | e.g. `628123456789` |
| J | site_status | string | `active` / `inactive` |
| K | max_active_jobs | number | |
| L | spreadsheet_id | string | ID of this company's per-company spreadsheet |
| M | cv_folder_id | string | ID of this company's CVs Drive folder |

### Per-company sheet: `[company]-database`

Three tabs named exactly **`Jobs`**, **`Candidates`**, **`Form_Logs`**:

#### Tab: `Jobs`
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

#### Tab: `Candidates`
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

#### Tab: `Form_Logs`
| Column | Header |
|--------|--------|
| A | timestamp |
| B | action |
| C | error |

---

## 4. Script Properties

In the Apps Script editor: **Project Settings → Script Properties**.

| Property | Value |
|----------|-------|
| `COMPANIES_SPREADSHEET_ID` | The ID from your `companies_database` Google Sheet URL (`/d/<ID>/edit`) |

> `CV_FOLDER_ID` is **removed** — the CV folder ID is now stored per-company in the `cv_folder_id` column of the Companies sheet.

---

## 5. Manual Company Provisioning

To add a new company:

1. **Create a Drive folder** named `[company]-dir/` (e.g. `acme-corp-dir/`) in your Drive root.
2. **Create a `CVs/` subfolder** inside it. Note the folder ID (from the URL).
3. **Create a spreadsheet** named `[company]-database` inside the folder.
   - Add three tabs: `Jobs`, `Candidates`, `Form_Logs` with the columns listed in §3.
   - Note the spreadsheet ID (from the URL).
4. **Add a row to the `Companies` tab** in `companies_database`:
   - Fill all columns including `spreadsheet_id` (from step 3) and `cv_folder_id` (from step 2).
5. Set the CVs folder sharing to **"Anyone with the link — Viewer"** so CV links work for the hiring team.

---

## 6. Create the Apps Script Project

**Option A — Standalone project (recommended)**

1. Go to [script.google.com](https://script.google.com) → **New project**.
2. Delete the default `myFunction` code.
3. Paste the contents of `Code.gs` into the editor.
4. Save the project (e.g. name it `WeHire Backend`).

**Option B — Bound to the Sheet**

1. In your `companies_database` Sheet, go to **Extensions → Apps Script**.
2. Replace all code with the contents of `Code.gs`.
3. Save.

---

## 7. Deploy as Web App

1. In the Apps Script editor click **Deploy → New deployment**.
2. Click the gear next to **Select type** → choose **Web app**.
3. Set:
   - **Description**: `v1` (or any label)
   - **Execute as**: `Me` (your Google account)
   - **Who has access**: `Anyone`
4. Click **Deploy** → authorise the required permissions.
5. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/<ID>/exec`).

Add the URL to `.env.local` at the project root:

```env
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/<YOUR_DEPLOYMENT_ID>/exec
```

> Every time you update `Code.gs` you must create a **new deployment** (or redeploy the existing one). The URL stays the same if you update an existing deployment.

---

## 8. API Reference

| Method | Parameters | Response |
|--------|-----------|----------|
| `GET ?action=getCompany&slug=X` | `slug` — company URL slug | `{ data: CompanyDTO }` |
| `GET ?action=getJobs&companyId=X` | `companyId` — company ID | `{ data: JobDTO[] }` |
| `GET ?action=getJob&jobId=X&companyId=X` | `jobId` — job ID; `companyId` — **required** | `{ data: JobDTO }` |
| `POST` (multipart/form-data) | See `ApplicationPayload` fields | `{ success: true }` or `{ error: "..." }` |

All error responses have the shape `{ error: "message" }`. Check the `Form_Logs` tab in the company's spreadsheet for full error context.

> **Breaking change:** `getJob` now requires a `companyId` parameter in addition to `jobId`.

---

## 9. End-to-End Verification

After deploying a new version:

1. **Company data** — `GET ?action=getCompany&slug=test-company`
   - Expect: `{ data: { id, name, slug, ..., spreadsheet_id, cv_folder_id } }`

2. **Job listing** — `GET ?action=getJobs&companyId=1`
   - Expect: `{ data: [...] }` fetched from `test-company-database`

3. **Single job** — `GET ?action=getJob&jobId=101&companyId=1`
   - Expect: `{ data: { id: "101", ... } }` (new required `companyId` param)

4. **Application submission** — POST with all required fields + CV file
   - Expect: new row in `Candidates` tab of `test-company-database`
   - Expect: CV uploaded to `test-company-dir/CVs/`

5. **Error logging** — trigger an error (e.g. invalid companyId)
   - Expect: error logged to `Form_Logs` tab in the relevant company spreadsheet (or `console.error` if no company context)
