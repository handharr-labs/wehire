// ============================================================
// WeHire — Google Apps Script Backend (multi-tenant)
// Deploy as: Execute as Me | Who has access: Anyone
// Script Properties required:
//   COMPANIES_SPREADSHEET_ID — ID of the global companies_database Sheet
//   ROOT_FOLDER_ID           — ID of the Drive root folder containing all {slug}-dir/ folders
// ============================================================

var COMPANIES_SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('COMPANIES_SPREADSHEET_ID');
var ROOT_FOLDER_ID           = PropertiesService.getScriptProperties().getProperty('ROOT_FOLDER_ID');
var ADMIN_API_SECRET         = PropertiesService.getScriptProperties().getProperty('ADMIN_API_SECRET');

// ------------------------------------------------------------
// Routing
// ------------------------------------------------------------

function doGet(e) {
  try {
    var action = e.parameter.action;

    if (action === 'getCompany') return handleGetCompany(e);
    if (action === 'getJobs')   return handleGetJobs(e);
    if (action === 'getJob')    return handleGetJob(e);

    return jsonResponse({ error: 'Unknown action: ' + action }, 400);
  } catch (err) {
    logError('doGet:' + (e.parameter.action || 'unknown'), err);
    return jsonResponse({ error: err.message }, 500);
  }
}

function doPost(e) {
  try {
    if (e.postData && e.postData.type === 'application/json') {
      var body = JSON.parse(e.postData.contents);
      if (body.action === 'getAdminByEmail') return handleGetAdminByEmail(body);
      return jsonResponse({ error: 'Unknown action: ' + body.action }, 400);
    }
    return handleSubmitApplication(e);
  } catch (err) {
    logError('doPost:submitApplication', err);
    return jsonResponse({ error: err.message }, 500);
  }
}

// Apps Script web apps don't support custom HTTP status codes via
// ContentService, but we keep the payload shape for client awareness.
// Preflight OPTIONS requests are handled automatically by Google's
// infrastructure when deployed as "Anyone".

// ------------------------------------------------------------
// Multi-tenant helpers
// ------------------------------------------------------------

function getCompaniesSheet() {
  return SpreadsheetApp.openById(COMPANIES_SPREADSHEET_ID).getSheetByName('Companies');
}

function findCompanyBySlug(slug) {
  var sheet   = getCompaniesSheet();
  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];

  for (var i = 1; i < rows.length; i++) {
    var row = rowToObject(headers, rows[i]);
    if (row.slug === slug) return row;
  }
  return null;
}

function findCompanyById(companyId) {
  var sheet   = getCompaniesSheet();
  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];

  for (var i = 1; i < rows.length; i++) {
    var row = rowToObject(headers, rows[i]);
    if (String(row.id) === String(companyId)) return row;
  }
  return null;
}

function openCompanySpreadsheet(slug) {
  var root    = DriveApp.getFolderById(ROOT_FOLDER_ID);
  var dirIter = root.getFoldersByName(slug + '-dir');
  if (!dirIter.hasNext()) throw new Error('Company folder not found: ' + slug + '-dir');
  var companyDir = dirIter.next();

  var fileIter = companyDir.getFilesByName(slug + '-database');
  if (!fileIter.hasNext()) throw new Error('Company database not found: ' + slug + '-database');
  var spreadsheetId = fileIter.next().getId();

  return SpreadsheetApp.openById(spreadsheetId);
}

function openCompanyResources(slug) {
  var root    = DriveApp.getFolderById(ROOT_FOLDER_ID);
  var dirIter = root.getFoldersByName(slug + '-dir');
  if (!dirIter.hasNext()) throw new Error('Company folder not found: ' + slug + '-dir');
  var companyDir = dirIter.next();

  var fileIter = companyDir.getFilesByName(slug + '-database');
  if (!fileIter.hasNext()) throw new Error('Company database not found: ' + slug + '-database');
  var spreadsheetId = fileIter.next().getId();

  var cvIter = companyDir.getFoldersByName('CVs');
  var cvFolderId = cvIter.hasNext()
    ? cvIter.next().getId()
    : companyDir.createFolder('CVs').getId();

  return {
    spreadsheet: SpreadsheetApp.openById(spreadsheetId),
    cvFolderId:  cvFolderId
  };
}

// ------------------------------------------------------------
// GET handlers
// ------------------------------------------------------------

function handleGetCompany(e) {
  var slug = e.parameter.slug;
  if (!slug) return jsonResponse({ error: 'Missing parameter: slug' }, 400);

  var company = findCompanyBySlug(slug);
  if (!company) return jsonResponse({ error: 'Company not found: ' + slug }, 404);

  return jsonResponse({ data: toCompanyDTO(company) });
}

function handleGetJobs(e) {
  var companyId = e.parameter.companyId;
  if (!companyId) return jsonResponse({ error: 'Missing parameter: companyId' }, 400);

  var company = findCompanyById(companyId);
  if (!company) return jsonResponse({ error: 'Company not found: ' + companyId }, 404);

  var ss      = openCompanySpreadsheet(company.slug);
  var sheet   = ss.getSheetByName('Jobs');
  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var jobs    = [];

  for (var i = 1; i < rows.length; i++) {
    jobs.push(toJobDTO(rowToObject(headers, rows[i])));
  }

  return jsonResponse({ data: jobs });
}

function handleGetJob(e) {
  var jobId     = e.parameter.jobId;
  var companyId = e.parameter.companyId;
  if (!jobId)     return jsonResponse({ error: 'Missing parameter: jobId' }, 400);
  if (!companyId) return jsonResponse({ error: 'Missing parameter: companyId' }, 400);

  var company = findCompanyById(companyId);
  if (!company) return jsonResponse({ error: 'Company not found: ' + companyId }, 404);

  var ss      = openCompanySpreadsheet(company.slug);
  var sheet   = ss.getSheetByName('Jobs');
  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];

  for (var i = 1; i < rows.length; i++) {
    var row = rowToObject(headers, rows[i]);
    if (String(row.id) === String(jobId)) {
      return jsonResponse({ data: toJobDTO(row) });
    }
  }

  return jsonResponse({ error: 'Job not found: ' + jobId }, 404);
}

// ------------------------------------------------------------
// POST handler — multipart/form-data application submission
// ------------------------------------------------------------

function handleSubmitApplication(e) {
  // Apps Script parses multipart/form-data automatically into
  // e.parameters (text fields) and e.files (blobs, not always available
  // depending on client). We support both paths.
  var params = e.parameters || {};

  function field(name) {
    var v = params[name];
    return v ? (Array.isArray(v) ? v[0] : v) : '';
  }

  var jobId             = field('jobId');
  var companyId         = field('companyId');
  var fullName          = field('fullName');
  var email             = field('email');
  var phone             = field('phone');
  var city              = field('city');
  var experienceSummary = field('experienceSummary');
  var expectedSalary    = field('expectedSalary');
  var linkedinUrl       = field('linkedinUrl');
  var portfolioUrl      = field('portfolioUrl');
  var coverLetter       = field('coverLetter');

  // Required fields validation
  var missing = [];
  ['jobId','companyId','fullName','email','phone','city','experienceSummary','expectedSalary']
    .forEach(function(f) { if (!field(f)) missing.push(f); });
  if (missing.length) {
    return jsonResponse({ error: 'Missing required fields: ' + missing.join(', ') }, 400);
  }

  var company = findCompanyById(companyId);
  if (!company) return jsonResponse({ error: 'Company not found: ' + companyId }, 404);

  var companyResources = openCompanyResources(company.slug);
  var companySS        = companyResources.spreadsheet;

  // CV upload
  var cvUrl = '';
  try {
    var cvBlob = null;

    // When sent as multipart, the blob may come through e.postData or via
    // named file parameter depending on the HTTP client.
    if (e.files && e.files['cvFile']) {
      cvBlob = e.files['cvFile'];
    } else if (params['cvFile'] && params['cvFile'][0]) {
      // Some clients base64-encode the file content as a text field
      var b64      = params['cvFile'][0];
      var mimeType = params['cvFileMime']  ? params['cvFileMime'][0]  : 'application/octet-stream';
      var fileName = params['cvFileName']  ? params['cvFileName'][0]  : 'cv_' + jobId + '_' + Date.now();
      cvBlob = Utilities.newBlob(Utilities.base64Decode(b64), mimeType, fileName);
    }

    if (cvBlob) {
      var folder     = DriveApp.getFolderById(companyResources.cvFolderId);
      var cvFileName = 'CV_' + fullName.replace(/\s+/g, '_') + '_' + jobId + '_' + Date.now();
      var cvFile     = folder.createFile(cvBlob.setName(cvFileName));
      cvFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      cvUrl = cvFile.getUrl();
    }
  } catch (uploadErr) {
    logError('submitApplication:cvUpload', uploadErr, companySS);
    // Non-fatal — proceed without CV URL but log it
    cvUrl = 'UPLOAD_ERROR: ' + uploadErr.message;
  }

  // Append to Candidates sheet in the company spreadsheet
  var sheet     = companySS.getSheetByName('Candidates');
  var timestamp = new Date().toISOString();

  sheet.appendRow([
    timestamp,
    jobId,
    companyId,
    fullName,
    email,
    phone,
    city,
    experienceSummary,
    expectedSalary,
    cvUrl,
    linkedinUrl,
    portfolioUrl,
    coverLetter
  ]);

  return jsonResponse({ success: true });
}

// ------------------------------------------------------------
// Admin auth
// ------------------------------------------------------------

function validateAdminSecret(secret) {
  return ADMIN_API_SECRET && secret === ADMIN_API_SECRET;
}

function getAdminsSheet() {
  return SpreadsheetApp.openById(COMPANIES_SPREADSHEET_ID).getSheetByName('Admins');
}

function toAdminDTO(row) {
  return {
    admin_id:        String(row.admin_id        || ''),
    email:           String(row.email           || ''),
    hashed_password: String(row.hashed_password || ''),
    role:            String(row.role            || ''),
    company_id:      row.company_id ? String(row.company_id) : null
  };
}

function handleGetAdminByEmail(body) {
  if (!validateAdminSecret(body.secret)) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }

  var email = body.email;
  if (!email) return jsonResponse({ error: 'Missing parameter: email' }, 400);

  var sheet   = getAdminsSheet();
  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];

  for (var i = 1; i < rows.length; i++) {
    var row = rowToObject(headers, rows[i]);
    if (String(row.email).toLowerCase() === String(email).toLowerCase()) {
      return jsonResponse({ data: toAdminDTO(row) });
    }
  }

  return jsonResponse({ error: 'Admin not found' }, 404);
}

// ------------------------------------------------------------
// DTO mappers (sheet row → typed object)
// ------------------------------------------------------------

function toCompanyDTO(row) {
  return {
    id:               String(row.id               || ''),
    name:             String(row.name             || ''),
    slug:             String(row.slug             || ''),
    logo_url:         String(row.logo_url         || ''),
    primary_color:    String(row.primary_color    || ''),
    secondary_color:  String(row.secondary_color  || ''),
    description:      String(row.description      || ''),
    contact_email:    String(row.contact_email    || ''),
    whatsapp_number:  String(row.whatsapp_number  || ''),
    site_status:      String(row.site_status      || ''),
    max_active_jobs:  Number(row.max_active_jobs  || 0)
  };
}

function toJobDTO(row) {
  return {
    id:              String(row.id              || ''),
    company_id:      String(row.company_id      || ''),
    title:           String(row.title           || ''),
    department:      String(row.department      || ''),
    location:        String(row.location        || ''),
    employment_type: String(row.employment_type || ''),
    min_salary:      Number(row.min_salary      || 0),
    max_salary:      Number(row.max_salary      || 0),
    description:     String(row.description     || ''),
    requirements:    String(row.requirements    || ''),
    status:          String(row.status          || ''),
    expired_at:      row.expired_at ? String(row.expired_at) : '',
    sort_order:      Number(row.sort_order      || 0)
  };
}

// ------------------------------------------------------------
// Utilities
// ------------------------------------------------------------

function rowToObject(headers, row) {
  var obj = {};
  for (var i = 0; i < headers.length; i++) {
    obj[headers[i]] = row[i];
  }
  return obj;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// companySpreadsheet is optional — if provided, writes to that company's
// Form_Logs sheet; otherwise falls back to console.error only.
function logError(action, err, companySpreadsheet) {
  try {
    var ss = companySpreadsheet || null;
    if (ss) {
      var sheet = ss.getSheetByName('Form_Logs');
      if (sheet) {
        sheet.appendRow([new Date().toISOString(), action, err.message || String(err)]);
      }
    } else {
      console.error('[' + action + ']', err.message || String(err));
    }
  } catch (logErr) {
    // Swallow — logging must never throw
    console.error('Failed to log error:', logErr);
  }
}
