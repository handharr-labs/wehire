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

    if (action === 'getCompanies')  return handleGetCompanies(e);
    if (action === 'getCompany')    return handleGetCompany(e);
    if (action === 'getJobs')       return handleGetJobs(e);
    if (action === 'getJob')        return handleGetJob(e);
    if (action === 'getJobBySlug')  return handleGetJobBySlug(e);
    if (action === 'getFormFields') return handleGetFormFields(e);

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
      if (body.action === 'getAdminByEmail')    return handleGetAdminByEmail(body);
      if (body.action === 'createJob')          return handleCreateJob(body);
      if (body.action === 'updateJob')          return handleUpdateJob(body);
      if (body.action === 'deleteJob')          return handleDeleteJob(body);
      if (body.action === 'updateCompany')      return handleUpdateCompany(body);
      if (body.action === 'createFormField')    return handleCreateFormField(body);
      if (body.action === 'updateFormField')    return handleUpdateFormField(body);
      if (body.action === 'deleteFormField')    return handleDeleteFormField(body);
      if (body.action === 'reorderFormFields')  return handleReorderFormFields(body);
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

  return {
    spreadsheet: SpreadsheetApp.openById(spreadsheetId),
    companyDir:  companyDir
  };
}

function getOrCreateFolder(parentFolder, name) {
  var iter = parentFolder.getFoldersByName(name);
  return iter.hasNext() ? iter.next() : parentFolder.createFolder(name);
}

function findJobTitle(companySS, jobId) {
  var sheet   = companySS.getSheetByName('Jobs');
  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  for (var i = 1; i < rows.length; i++) {
    var row = rowToObject(headers, rows[i]);
    if (String(row.id) === String(jobId)) return String(row.title || 'Unknown Job');
  }
  return 'Unknown Job';
}

// ------------------------------------------------------------
// GET handlers
// ------------------------------------------------------------

function handleGetCompanies(e) {
  var sheet   = getCompaniesSheet();
  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var companies = [];

  for (var i = 1; i < rows.length; i++) {
    companies.push(toCompanyDTO(rowToObject(headers, rows[i])));
  }

  return jsonResponse({ data: companies });
}

function handleGetCompany(e) {
  var companyId = e.parameter.companyId;
  var slug      = e.parameter.slug;

  if (!companyId && !slug) return jsonResponse({ error: 'Missing parameter: companyId or slug' }, 400);

  var company = companyId ? findCompanyById(companyId) : findCompanyBySlug(slug);
  if (!company) return jsonResponse({ error: 'Company not found' }, 404);

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

function handleGetJobBySlug(e) {
  var jobId = e.parameter.jobId;
  var slug  = e.parameter.slug;
  if (!jobId) return jsonResponse({ error: 'Missing parameter: jobId' }, 400);
  if (!slug)  return jsonResponse({ error: 'Missing parameter: slug' }, 400);

  var ss      = openCompanySpreadsheet(slug);
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
// POST handlers — admin job management (JSON body, requires secret)
// ------------------------------------------------------------

function handleCreateJob(body) {
  if (!validateAdminSecret(body.secret)) return jsonResponse({ error: 'Forbidden' }, 403);

  var companyId = body.companyId;
  if (!companyId) return jsonResponse({ error: 'Missing parameter: companyId' }, 400);

  var company = findCompanyById(companyId);
  if (!company) return jsonResponse({ error: 'Company not found: ' + companyId }, 404);

  var ss    = openCompanySpreadsheet(company.slug);
  var sheet = ss.getSheetByName('Jobs');
  var rows  = sheet.getDataRange().getValues();

  // Generate a simple incremental ID
  var maxId = 0;
  for (var i = 1; i < rows.length; i++) {
    var rowId = Number(rows[i][0]);
    if (rowId > maxId) maxId = rowId;
  }
  var newId = String(maxId + 1);

  var now = new Date().toISOString();

  ensureColumn(sheet, 'target_city');

  appendRowByColumnMap(sheet, {
    id:              newId,
    company_id:      companyId,
    title:           String(body.title           || ''),
    department:      String(body.department      || ''),
    location:        String(body.location        || ''),
    employment_type: String(body.employment_type || 'full-time'),
    min_salary:      Number(body.min_salary      || 0),
    max_salary:      Number(body.max_salary      || 0),
    description:     String(body.description     || ''),
    requirements:    String(body.requirements    || ''),
    status:          String(body.status          || 'draft'),
    expired_at:      String(body.expired_at      || ''),
    sort_order:      Number(body.sort_order      || 0),
    target_city:     String(body.target_city     || '')
  });

  return jsonResponse({ data: { id: newId, created_at: now } });
}

function handleUpdateJob(body) {
  if (!validateAdminSecret(body.secret)) return jsonResponse({ error: 'Forbidden' }, 403);

  var jobId     = body.jobId;
  var companyId = body.companyId;
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
      var sheetRow = i + 1; // 1-indexed, +1 for header
      var colMap   = {};
      for (var c = 0; c < headers.length; c++) colMap[headers[c]] = c + 1;

      if (body.title        !== undefined) sheet.getRange(sheetRow, colMap['title']).setValue(body.title);
      if (body.department   !== undefined) sheet.getRange(sheetRow, colMap['department']).setValue(body.department);
      if (body.location     !== undefined) sheet.getRange(sheetRow, colMap['location']).setValue(body.location);
      if (body.employment_type !== undefined) sheet.getRange(sheetRow, colMap['employment_type']).setValue(body.employment_type);
      if (body.min_salary   !== undefined) sheet.getRange(sheetRow, colMap['min_salary']).setValue(Number(body.min_salary));
      if (body.max_salary   !== undefined) sheet.getRange(sheetRow, colMap['max_salary']).setValue(Number(body.max_salary));
      if (body.description  !== undefined) sheet.getRange(sheetRow, colMap['description']).setValue(body.description);
      if (body.requirements !== undefined) sheet.getRange(sheetRow, colMap['requirements']).setValue(body.requirements);
      if (body.status       !== undefined) sheet.getRange(sheetRow, colMap['status']).setValue(body.status);
      if (body.expired_at   !== undefined) sheet.getRange(sheetRow, colMap['expired_at']).setValue(body.expired_at);
      if (body.sort_order   !== undefined) sheet.getRange(sheetRow, colMap['sort_order']).setValue(Number(body.sort_order));
      if (body.target_city  !== undefined) {
        var tcCol = ensureColumn(sheet, 'target_city');
        sheet.getRange(sheetRow, tcCol).setValue(String(body.target_city));
      }

      return jsonResponse({ success: true });
    }
  }

  return jsonResponse({ error: 'Job not found: ' + jobId }, 404);
}

function handleDeleteJob(body) {
  if (!validateAdminSecret(body.secret)) return jsonResponse({ error: 'Forbidden' }, 403);

  var jobId     = body.jobId;
  var companyId = body.companyId;
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
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true });
    }
  }

  return jsonResponse({ error: 'Job not found: ' + jobId }, 404);
}

function handleUpdateCompany(body) {
  if (!validateAdminSecret(body.secret)) return jsonResponse({ error: 'Forbidden' }, 403);

  var companyId = body.companyId;
  if (!companyId) return jsonResponse({ error: 'Missing parameter: companyId' }, 400);

  var sheet   = getCompaniesSheet();
  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];

  for (var i = 1; i < rows.length; i++) {
    var row = rowToObject(headers, rows[i]);
    if (String(row.id) === String(companyId)) {
      var sheetRow = i + 1;
      var colMap   = {};
      for (var c = 0; c < headers.length; c++) colMap[headers[c]] = c + 1;

      if (body.name             !== undefined) sheet.getRange(sheetRow, colMap['name']).setValue(body.name);
      if (body.logo_url         !== undefined) sheet.getRange(sheetRow, colMap['logo_url']).setValue(body.logo_url);
      if (body.primary_color    !== undefined) sheet.getRange(sheetRow, colMap['primary_color']).setValue(body.primary_color);
      if (body.secondary_color  !== undefined) sheet.getRange(sheetRow, colMap['secondary_color']).setValue(body.secondary_color);
      if (body.description      !== undefined) sheet.getRange(sheetRow, colMap['description']).setValue(body.description);
      if (body.contact_email    !== undefined) sheet.getRange(sheetRow, colMap['contact_email']).setValue(body.contact_email);
      if (body.whatsapp_number  !== undefined) sheet.getRange(sheetRow, colMap['whatsapp_number']).setValue(body.whatsapp_number);
      if (body.site_status      !== undefined) sheet.getRange(sheetRow, colMap['site_status']).setValue(body.site_status);
      if (body.scoring_enabled  !== undefined) {
        var seCol = ensureColumn(sheet, 'scoring_enabled');
        sheet.getRange(sheetRow, seCol).setValue(body.scoring_enabled === true || body.scoring_enabled === 'true');
      }

      return jsonResponse({ success: true });
    }
  }

  return jsonResponse({ error: 'Company not found: ' + companyId }, 404);
}

// ------------------------------------------------------------
// Form Fields — default seed data
// ------------------------------------------------------------

var DEFAULT_FORM_FIELDS = [
  { id: 'sys_1',  label: 'Full Name',           field_name: 'full_name',          type: 'text',     required: true,  options: '', sort_order: 1,  enabled: true, is_system: true },
  { id: 'sys_2',  label: 'Email',               field_name: 'email',              type: 'email',    required: true,  options: '', sort_order: 2,  enabled: true, is_system: true },
  { id: 'sys_3',  label: 'Phone',               field_name: 'phone',              type: 'tel',      required: true,  options: '', sort_order: 3,  enabled: true, is_system: true },
  { id: 'sys_4',  label: 'City',                field_name: 'city',               type: 'text',     required: true,  options: '', sort_order: 4,  enabled: true, is_system: true },
  { id: 'sys_5',  label: 'Experience Summary',  field_name: 'experience_summary', type: 'textarea', required: true,  options: '', sort_order: 5,  enabled: true, is_system: true },
  { id: 'sys_6',  label: 'Expected Salary',     field_name: 'expected_salary',    type: 'number',   required: true,  options: '', sort_order: 6,  enabled: true, is_system: true },
  { id: 'sys_7',  label: 'CV / Resume',         field_name: 'cv_url',             type: 'file',     required: true,  options: '', sort_order: 7,  enabled: true, is_system: true },
  { id: 'sys_8',  label: 'LinkedIn URL',        field_name: 'linkedin_url',       type: 'url',      required: false, options: '', sort_order: 8,  enabled: true, is_system: true },
  { id: 'sys_9',  label: 'Portfolio URL',       field_name: 'portfolio_url',      type: 'url',      required: false, options: '', sort_order: 9,  enabled: true, is_system: true },
  { id: 'sys_10', label: 'Cover Letter',        field_name: 'cover_letter',       type: 'textarea', required: false, options: '', sort_order: 10, enabled: true, is_system: true }
];

/**
 * Returns the Form_Fields sheet for the given spreadsheet,
 * creating and seeding it if it does not yet exist.
 */
function initFormFields(ss) {
  var sheet = ss.getSheetByName('Form_Fields');
  if (sheet) return sheet;

  sheet = ss.insertSheet('Form_Fields');
  sheet.appendRow(['id', 'label', 'field_name', 'type', 'required', 'options', 'sort_order', 'enabled', 'is_system']);
  for (var i = 0; i < DEFAULT_FORM_FIELDS.length; i++) {
    var f = DEFAULT_FORM_FIELDS[i];
    sheet.appendRow([f.id, f.label, f.field_name, f.type, f.required, f.options, f.sort_order, f.enabled, f.is_system]);
  }
  return sheet;
}

/** Converts a label to a snake_case field_name. */
function slugify(label) {
  return String(label)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function toFormFieldDTO(row) {
  return {
    id:         String(row.id         || ''),
    label:      String(row.label      || ''),
    field_name: String(row.field_name || ''),
    type:       String(row.type       || 'text'),
    required:   row.required  === true || String(row.required).toLowerCase()  === 'true',
    options:    String(row.options    || ''),
    sort_order: Number(row.sort_order || 0),
    enabled:    row.enabled   === true || String(row.enabled).toLowerCase()   === 'true',
    is_system:  row.is_system === true || String(row.is_system).toLowerCase() === 'true'
  };
}

// ------------------------------------------------------------
// Form Fields — GET handler
// ------------------------------------------------------------

function handleGetFormFields(e) {
  var companyId = e.parameter.companyId;
  if (!companyId) return jsonResponse({ error: 'Missing parameter: companyId' }, 400);

  var company = findCompanyById(companyId);
  if (!company) return jsonResponse({ error: 'Company not found: ' + companyId }, 404);

  var ss    = openCompanySpreadsheet(company.slug);
  var sheet = initFormFields(ss);
  var rows  = sheet.getDataRange().getValues();
  var headers = rows[0];
  var fields  = [];

  for (var i = 1; i < rows.length; i++) {
    fields.push(toFormFieldDTO(rowToObject(headers, rows[i])));
  }

  return jsonResponse({ data: fields });
}

// ------------------------------------------------------------
// Form Fields — POST handlers (admin, require secret)
// ------------------------------------------------------------

function handleCreateFormField(body) {
  if (!validateAdminSecret(body.secret)) return jsonResponse({ error: 'Forbidden' }, 403);

  var companyId = body.companyId;
  if (!companyId)  return jsonResponse({ error: 'Missing parameter: companyId' }, 400);
  if (!body.label) return jsonResponse({ error: 'Missing parameter: label' }, 400);
  if (!body.type)  return jsonResponse({ error: 'Missing parameter: type' }, 400);

  var company = findCompanyById(companyId);
  if (!company) return jsonResponse({ error: 'Company not found: ' + companyId }, 404);

  var ss    = openCompanySpreadsheet(company.slug);
  var sheet = initFormFields(ss);

  var fieldName = slugify(body.label);

  // Ensure field_name is unique among enabled fields
  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var existing = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rowToObject(headers, rows[i]);
    if (r.enabled !== false && String(r.enabled).toLowerCase() !== 'false') {
      existing.push(String(r.field_name));
    }
  }
  if (existing.indexOf(fieldName) !== -1) {
    fieldName = fieldName + '_' + Date.now();
  }

  // Max sort_order
  var maxOrder = 0;
  for (var j = 1; j < rows.length; j++) {
    var o = Number(rows[j][6]);
    if (o > maxOrder) maxOrder = o;
  }

  var newId     = 'cf_' + Date.now();
  var sortOrder = body.sort_order != null ? Number(body.sort_order) : maxOrder + 1;
  var required  = body.required === true || body.required === 'true';
  var options   = body.options || '';

  sheet.appendRow([newId, body.label, fieldName, body.type, required, options, sortOrder, true, false]);

  // Add column to Candidates sheet
  var candidatesSheet = ss.getSheetByName('Candidates');
  if (candidatesSheet) ensureColumn(candidatesSheet, fieldName);

  return jsonResponse({ data: { id: newId, field_name: fieldName } });
}

function handleUpdateFormField(body) {
  if (!validateAdminSecret(body.secret)) return jsonResponse({ error: 'Forbidden' }, 403);

  var companyId = body.companyId;
  var fieldId   = body.fieldId;
  if (!companyId) return jsonResponse({ error: 'Missing parameter: companyId' }, 400);
  if (!fieldId)   return jsonResponse({ error: 'Missing parameter: fieldId' }, 400);

  var company = findCompanyById(companyId);
  if (!company) return jsonResponse({ error: 'Company not found: ' + companyId }, 404);

  var ss    = openCompanySpreadsheet(company.slug);
  var sheet = initFormFields(ss);

  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var colMap  = {};
  for (var c = 0; c < headers.length; c++) colMap[headers[c]] = c + 1;

  for (var i = 1; i < rows.length; i++) {
    var row = rowToObject(headers, rows[i]);
    if (String(row.id) !== String(fieldId)) continue;

    var sheetRow = i + 1;
    var isSystem = row.is_system === true || String(row.is_system).toLowerCase() === 'true';

    // Label change
    if (body.label !== undefined && body.label !== row.label) {
      sheet.getRange(sheetRow, colMap['label']).setValue(body.label);

      // For custom fields: derive new field_name and rename Candidates column
      if (!isSystem) {
        var oldFieldName = String(row.field_name);
        var newFieldName = slugify(body.label);
        if (newFieldName !== oldFieldName) {
          sheet.getRange(sheetRow, colMap['field_name']).setValue(newFieldName);

          var candidatesSheet = ss.getSheetByName('Candidates');
          if (candidatesSheet) {
            var lastCol = candidatesSheet.getLastColumn();
            if (lastCol > 0) {
              var cHeaders = candidatesSheet.getRange(1, 1, 1, lastCol).getValues()[0];
              var colIdx   = cHeaders.indexOf(oldFieldName);
              if (colIdx !== -1) {
                candidatesSheet.getRange(1, colIdx + 1).setValue(newFieldName);
              } else {
                // Column didn't exist yet — create it under the new name
                ensureColumn(candidatesSheet, newFieldName);
              }
            }
          }
        }
      }
    }

    if (body.required !== undefined) {
      sheet.getRange(sheetRow, colMap['required']).setValue(
        body.required === true || body.required === 'true'
      );
    }
    if (body.options !== undefined) {
      sheet.getRange(sheetRow, colMap['options']).setValue(body.options);
    }
    if (body.enabled !== undefined) {
      // Core system fields (sort_order <= 7) cannot be disabled
      var sortOrder = Number(row.sort_order);
      if (isSystem && sortOrder <= 7) {
        return jsonResponse({ error: 'Cannot disable core system fields' }, 400);
      }
      sheet.getRange(sheetRow, colMap['enabled']).setValue(
        body.enabled === true || body.enabled === 'true'
      );
    }

    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: 'Field not found: ' + fieldId }, 404);
}

function handleDeleteFormField(body) {
  if (!validateAdminSecret(body.secret)) return jsonResponse({ error: 'Forbidden' }, 403);

  var companyId = body.companyId;
  var fieldId   = body.fieldId;
  if (!companyId) return jsonResponse({ error: 'Missing parameter: companyId' }, 400);
  if (!fieldId)   return jsonResponse({ error: 'Missing parameter: fieldId' }, 400);

  var company = findCompanyById(companyId);
  if (!company) return jsonResponse({ error: 'Company not found: ' + companyId }, 404);

  var ss    = openCompanySpreadsheet(company.slug);
  var sheet = initFormFields(ss);

  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var colMap  = {};
  for (var c = 0; c < headers.length; c++) colMap[headers[c]] = c + 1;

  for (var i = 1; i < rows.length; i++) {
    var row = rowToObject(headers, rows[i]);
    if (String(row.id) !== String(fieldId)) continue;

    var isSystem = row.is_system === true || String(row.is_system).toLowerCase() === 'true';
    if (isSystem) return jsonResponse({ error: 'Cannot delete system fields' }, 400);

    // Soft delete — mark the Candidates column header and disable the field
    var fieldName = String(row.field_name);
    var candidatesSheet = ss.getSheetByName('Candidates');
    if (candidatesSheet) {
      var lastCol = candidatesSheet.getLastColumn();
      if (lastCol > 0) {
        var cHeaders = candidatesSheet.getRange(1, 1, 1, lastCol).getValues()[0];
        var colIdx   = cHeaders.indexOf(fieldName);
        if (colIdx !== -1) {
          candidatesSheet.getRange(1, colIdx + 1).setValue('[deleted]_' + fieldName);
        }
      }
    }
    sheet.getRange(i + 1, colMap['enabled']).setValue(false);
    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: 'Field not found: ' + fieldId }, 404);
}

function handleReorderFormFields(body) {
  if (!validateAdminSecret(body.secret)) return jsonResponse({ error: 'Forbidden' }, 403);

  var companyId = body.companyId;
  var order     = body.order;
  if (!companyId)             return jsonResponse({ error: 'Missing parameter: companyId' }, 400);
  if (!order || !Array.isArray(order)) return jsonResponse({ error: 'Missing parameter: order' }, 400);

  var company = findCompanyById(companyId);
  if (!company) return jsonResponse({ error: 'Company not found: ' + companyId }, 404);

  var ss    = openCompanySpreadsheet(company.slug);
  var sheet = initFormFields(ss);

  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var colMap  = {};
  for (var c = 0; c < headers.length; c++) colMap[headers[c]] = c + 1;

  var orderMap = {};
  for (var k = 0; k < order.length; k++) {
    orderMap[String(order[k].id)] = Number(order[k].sort_order);
  }

  for (var i = 1; i < rows.length; i++) {
    var id = String(rows[i][0]);
    if (orderMap.hasOwnProperty(id)) {
      sheet.getRange(i + 1, colMap['sort_order']).setValue(orderMap[id]);
    }
  }

  return jsonResponse({ success: true });
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
  var screeningScore    = field('screeningScore');

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

  // Validate required custom fields
  var formFieldsSheet = initFormFields(companySS);
  var ffRows    = formFieldsSheet.getDataRange().getValues();
  var ffHeaders = ffRows[0];
  var missingCustom = [];
  for (var fi = 1; fi < ffRows.length; fi++) {
    var ff        = rowToObject(ffHeaders, ffRows[fi]);
    var ffEnabled = ff.enabled  === true || String(ff.enabled).toLowerCase()  === 'true';
    var ffReq     = ff.required === true || String(ff.required).toLowerCase() === 'true';
    var ffSystem  = ff.is_system === true || String(ff.is_system).toLowerCase() === 'true';
    if (!ffSystem && ffEnabled && ffReq && !field(String(ff.field_name))) {
      missingCustom.push(String(ff.label));
    }
  }
  if (missingCustom.length) {
    return jsonResponse({ error: 'Missing required fields: ' + missingCustom.join(', ') }, 400);
  }

  // CV upload — files are stored under {Job Title}/{timestamp} {fullName}/
  var submissionTimestamp = new Date().toISOString();
  var cvUrl = '';
  try {
    var jobTitle    = findJobTitle(companySS, jobId);
    var jobFolder   = getOrCreateFolder(companyResources.companyDir, jobTitle);
    var candFolderName = submissionTimestamp + ' ' + fullName;
    var candFolder  = getOrCreateFolder(jobFolder, candFolderName);

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
      var cvFileName = params['cvFileName'] ? params['cvFileName'][0] : cvBlob.getName();
      var cvFile     = candFolder.createFile(cvBlob.setName(cvFileName));
      cvFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      cvUrl = cvFile.getUrl();
    }
  } catch (uploadErr) {
    logError('submitApplication:cvUpload', uploadErr, companySS);
    // Non-fatal — proceed without CV URL but log it
    cvUrl = 'UPLOAD_ERROR: ' + uploadErr.message;
  }

  // Append to Candidates sheet — auto-add screening_score column if missing
  var sheet = companySS.getSheetByName('Candidates');
  ensureColumn(sheet, 'screening_score');

  var rowData = {
    timestamp:          submissionTimestamp,
    job_id:             jobId,
    company_id:         companyId,
    full_name:          fullName,
    email:              email,
    phone:              phone,
    city:               city,
    experience_summary: experienceSummary,
    expected_salary:    expectedSalary,
    cv_url:             cvUrl,
    linkedin_url:       linkedinUrl,
    portfolio_url:      portfolioUrl,
    cover_letter:       coverLetter,
    screening_score:    screeningScore !== '' ? Number(screeningScore) : ''
  };

  // Append enabled custom field values
  for (var ci = 1; ci < ffRows.length; ci++) {
    var cf       = rowToObject(ffHeaders, ffRows[ci]);
    var cfEnabled = cf.enabled  === true || String(cf.enabled).toLowerCase()  === 'true';
    var cfSystem  = cf.is_system === true || String(cf.is_system).toLowerCase() === 'true';
    if (!cfSystem && cfEnabled) {
      var cfName = String(cf.field_name);
      rowData[cfName] = field(cfName) || '';
    }
  }

  appendRowByColumnMap(sheet, rowData);

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
    max_active_jobs:  Number(row.max_active_jobs  || 0),
    scoring_enabled:  row.scoring_enabled === true || String(row.scoring_enabled).toLowerCase() === 'true'
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
    sort_order:      Number(row.sort_order      || 0),
    target_city:     String(row.target_city     || '')
  };
}

// ------------------------------------------------------------
// Utilities
// ------------------------------------------------------------

// Ensures a column header exists on the sheet.
// If missing, appends it at the end. Returns the 1-indexed column number.
function ensureColumn(sheet, columnName) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    sheet.getRange(1, 1).setValue(columnName);
    return 1;
  }
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var idx = headers.indexOf(columnName);
  if (idx !== -1) return idx + 1;
  var newCol = lastCol + 1;
  sheet.getRange(1, newCol).setValue(columnName);
  return newCol;
}

// Appends a row using an object keyed by column header name.
// Columns not present in `data` are written as empty string.
// Safe regardless of column order — relies on the header row.
function appendRowByColumnMap(sheet, data) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var row = headers.map(function(h) {
    return data.hasOwnProperty(h) ? data[h] : '';
  });
  sheet.appendRow(row);
}

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
