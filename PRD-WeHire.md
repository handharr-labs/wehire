# **Product Requirements Document (PRD)**

## **WeHire MVP \- Recruitment Microsite for MSME**

## **1\. Document Information**

* **Product Name:** WeHire  
* **Version:** MVP v1.0  
* **Document Owner:** Ahmad Farhan  
* **Prepared By:** ChatGPT  
* **Target Segment:** Small MSME / SMB with \<50 employees  
* **Status:** Draft

---

## **2\. Executive Summary**

WeHire is a lightweight recruitment microsite platform for small businesses that need a branded career page and a simple way to collect, store, and review applicants without adopting a complex ATS.

Each company gets a branded subdomain such as `companyname.wehire`, a public-facing career page, job listing page, job detail page, and candidate application form. All applicant data is stored directly in the company’s own Google Sheets and Google Drive, minimizing infrastructure complexity and eliminating the need for a traditional database.

The MVP focuses on the core value proposition:

* Branded hiring page for small businesses  
* Simple application flow for candidates  
* Automatic storage of candidate data to Google Sheets  
* Automatic storage of CV files to Google Drive  
* Lightweight candidate tracking through Google Sheets

WeHire is positioned as a practical alternative to WhatsApp-only hiring and overly complex ATS platforms for businesses with low hiring volume and limited HR operations.

---

## **3\. Background and Problem Statement**

### **3.1 Current Market Problem**

Small businesses in Indonesia often recruit using informal channels such as:

* WhatsApp status or group posts  
* Instagram posts or stories  
* Manual Google Form links  
* Job posters shared manually by admin  
* CV collection through email or chat

This creates several operational issues:

* No dedicated or professional-looking career page  
* Candidate data is scattered across email, chat, and file folders  
* No structured applicant list  
* Difficult to review or compare candidates  
* Limited employer branding for small businesses  
* Existing ATS tools are too expensive or too complex

### **3.2 Problem WeHire Solves**

WeHire helps small businesses build a professional branded hiring presence and manage incoming applicants in a simple, low-cost way using tools they already know: Google Drive and Google Sheets.

---

## **4\. Product Vision**

To become the simplest recruitment website and applicant collection platform for small businesses in Indonesia.

---

## **5\. Product Goals**

### **5.1 Business Goals**

1. Acquire early-stage paying SMB customers with an affordable subscription model  
2. Provide a low-cost SaaS offering with minimal infrastructure cost  
3. Validate willingness to pay for a branded hiring microsite product  
4. Achieve fast onboarding with limited implementation effort per client

### **5.2 Product Goals**

1. Enable each client to launch a career page quickly  
2. Allow candidates to submit applications easily from mobile or desktop  
3. Automatically store candidate metadata in Google Sheets  
4. Automatically store CV files in Google Drive folders  
5. Allow HR/admin to review applicants from a familiar interface

### **5.3 User Goals**

For business owners or HR admins:

* Have a professional career page  
* Collect all applications in one place  
* Avoid learning a complex system  
* Start hiring with minimal setup

For candidates:

* Easily find open positions  
* Read job details clearly  
* Apply in a few minutes  
* Upload CV without friction

---

## **6\. Non-Goals (MVP Exclusions)**

The following are intentionally excluded from MVP:

* Full ATS workflow with multiple stages and permissions  
* Interview scheduling  
* AI CV parsing and OCR  
* Advanced recruiter collaboration features  
* Candidate messaging inbox  
* Job posting distribution to third-party job boards  
* Employer custom domain setup (e.g. careers.company.com)  
* Multi-language localization  
* Advanced analytics dashboard  
* Talent pool or candidate CRM

---

## **7\. Target Users**

### **7.1 Primary User**

**Business Owner / HR Admin / Office Admin**

* Company size: \<50 employees  
* Limited or no dedicated recruiter  
* Hiring frequency: low to moderate  
* Uses Google tools and low-cost digital solutions  
* Needs simplicity more than advanced HR workflow

### **7.2 Secondary User**

**Candidate / Job Seeker**

* Applies through mobile or desktop  
* Needs a fast, clear, and reliable apply process  
* Expects a professional-looking company job page

---

## **8\. User Personas**

### **Persona A \- Small Business Owner**

* Runs a business with 10 to 30 employees  
* Handles hiring personally or through admin staff  
* Wants a professional hiring page without extra HR software  
* Price sensitive and prefers simple monthly subscription

### **Persona B \- Admin / HR Generalist**

* Responsible for posting vacancies and reviewing applications  
* Comfortable using Google Sheets and Google Drive  
* Does not want to manage a database or complicated tool

### **Persona C \- Applicant**

* Discovers a vacancy from social media or shared links  
* Wants a mobile-friendly application flow  
* Expects the process to be quick and easy

---

## **9\. Product Scope**

### **9.1 In Scope for MVP**

* Branded subdomain per company under `wehire`  
* Public company career page  
* Public list of active jobs  
* Public job detail page  
* Candidate application form  
* Candidate CV upload  
* Automatic save to Google Sheets  
* Automatic save to Google Drive  
* Job-specific CV folders  
* Basic candidate status tracking in Google Sheets  
* Basic company branding configuration  
* Basic plan limit handling (e.g. max active jobs)

### **9.2 Out of Scope for MVP**

* Direct integrations with job portals  
* Recruiter collaboration workflow  
* SMS/WhatsApp automation from system  
* AI ranking from CV document analysis  
* Interview scheduling tools  
* Assessment tools

---

## **10\. Product Positioning**

WeHire is not a full ATS.

WeHire is a **branded hiring microsite plus lightweight applicant collection system** built for businesses too small for expensive ATS software but too serious to manage recruitment only via WhatsApp or email.

---

## **11\. Core Value Proposition**

### **For Clients**

* Launch a branded career page quickly  
* Collect candidates in a structured way  
* Store data in tools already familiar to them  
* Avoid complexity and high cost

### **For WeHire**

* Minimal backend cost  
* Minimal infrastructure complexity  
* Faster MVP launch  
* Easier onboarding for non-technical businesses

---

## **12\. Assumptions**

1. Client has at least one Google account  
2. Client is willing to connect Google Drive and Google Sheets for storage  
3. Most clients have low to moderate applicant volume  
4. Most clients only need basic hiring workflow in MVP  
5. Candidates primarily apply via mobile devices

---

## **13\. Success Metrics**

### **13.1 Business Metrics**

* Number of paying companies onboarded  
* Conversion rate from trial to paid  
* Average revenue per client  
* Monthly churn rate

### **13.2 Product Metrics**

* Number of career pages launched  
* Number of active jobs per company  
* Number of candidate applications submitted  
* Application completion rate  
* Form error rate  
* Time from onboarding to first published job

### **13.3 Operational Metrics**

* Successful sync rate to Sheets and Drive  
* File upload success rate  
* Average onboarding time per client  
* Number of support tickets per active client

---

## **14\. User Journey**

### **14.1 Client Journey**

1. Client signs up or is onboarded by WeHire admin  
2. Client provides branding data and company information  
3. Client connects Google account or uses provided setup template  
4. WeHire creates/configures subdomain and company microsite  
5. Client adds or activates job postings  
6. Candidate applications begin to flow into Google Sheets and Google Drive  
7. Client reviews candidate list directly in Google Sheets

### **14.2 Candidate Journey**

1. Candidate opens company career page  
2. Candidate browses list of active job vacancies  
3. Candidate opens a job detail page  
4. Candidate fills out application form  
5. Candidate uploads CV  
6. Candidate submits form  
7. Candidate sees success confirmation

---

## **15\. Feature Requirements**

## **15.1 Company Career Microsite**

### **Description**

Each client will have a public-facing branded microsite hosted under a WeHire subdomain.

### **Functional Requirements**

1. System must generate and support unique subdomain for each company  
2. Career page must display company name, logo, short description, and active jobs  
3. Career page must be responsive on desktop and mobile  
4. Career page must support basic brand color customization  
5. Career page must support sections for company intro and hiring CTA

### **Acceptance Criteria**

* Company microsite is accessible publicly from a unique subdomain  
* Logo and brand color are reflected correctly  
* Active jobs are visible on the page  
* Layout works properly on mobile and desktop

---

## **15.2 Job Listing Page**

### **Description**

A public list of all active job openings for a company.

### **Functional Requirements**

1. System must display all active jobs for the company  
2. Each job card must show at minimum title, location, and employment type  
3. Inactive or expired jobs must not appear publicly  
4. Each job must link to its job detail page  
5. Optional sorting by newest or custom order should be supported

### **Acceptance Criteria**

* Only active jobs appear in the listing  
* Clicking a job card opens the correct detail page  
* Expired jobs are hidden automatically

---

## **15.3 Job Detail Page**

### **Description**

A dedicated page that shows full information for a specific job opening.

### **Functional Requirements**

1. System must display job title, description, requirements, and location  
2. System must show apply CTA on the job detail page  
3. System must allow hiding salary if client chooses not to show it  
4. System must support a status check to prevent applications to inactive jobs

### **Acceptance Criteria**

* Job detail content matches data in job configuration  
* Apply CTA is clearly visible  
* Inactive jobs cannot be applied to

---

## **15.4 Candidate Application Form**

### **Description**

Candidates can submit application data through a simple form.

### **Functional Requirements**

1. Form must collect required candidate information:  
   * full name  
   * email  
   * WhatsApp number  
   * domicile/city  
   * short experience summary  
   * expected salary  
   * CV upload  
2. Form must support optional fields such as LinkedIn, portfolio link, and cover letter  
3. Form must validate required fields before submit  
4. Form must prevent submission if job is inactive or invalid  
5. Form must support mobile-friendly interaction

### **Acceptance Criteria**

* Required fields must be filled before submit  
* Invalid file type or size must trigger error message  
* Successful submission displays confirmation state

---

## **15.5 CV Upload and File Storage**

### **Description**

Uploaded CV files will be stored in company-owned Google Drive folders.

### **Functional Requirements**

1. System must upload CV to a Google Drive folder associated with the applied job  
2. System must create or use job-specific folder structure  
3. System must rename CV files using a standard format  
4. System must store uploaded file URL back into Google Sheets  
5. System must enforce file type and file size rules

### **Suggested File Rules**

* Allowed types: PDF, DOC, DOCX  
* Max size: 2 MB to 3 MB for MVP

### **Acceptance Criteria**

* File is saved to correct Drive folder  
* File link is accessible from candidate row in sheet  
* Disallowed file type is rejected  
* Oversized file is rejected

---

## **15.6 Candidate Data Storage in Google Sheets**

### **Description**

All submitted application metadata will be stored in a Google Sheet.

### **Functional Requirements**

1. System must insert one new row per successful application  
2. Candidate row must include application timestamp, job ID, candidate data, CV file URL, and default status  
3. System must not create duplicate rows for failed submissions  
4. System must log submission errors in a separate log sheet or log mechanism

### **Acceptance Criteria**

* Every successful application creates one complete row  
* Candidate data fields map correctly to the configured columns  
* Failed upload does not create a misleading candidate row

---

## **15.7 Candidate Status Tracking**

### **Description**

Clients can track candidate progress through Google Sheets.

### **Functional Requirements**

1. Newly submitted candidates must default to status `New`  
2. Recommended statuses for MVP:  
   * New  
   * Review  
   * Shortlisted  
   * Interview  
   * Rejected  
   * Hired  
3. Status must be editable directly in Google Sheets  
4. Optional score and reviewer notes fields should be supported

### **Acceptance Criteria**

* Default status is populated correctly  
* Client can update status directly in the sheet  
* Status changes do not break reporting or row integrity

---

## **15.8 Basic Scoring (Rule-Based)**

### **Description**

The MVP may include lightweight rule-based scoring based on form responses only.

### **Functional Requirements**

1. System may assign a simple score based on predefined rules  
2. Scoring logic must use form field responses, not CV parsing  
3. Score must be saved to Google Sheets  
4. Score logic must be configurable per job or globally in future phases

### **Sample Scoring Inputs**

* years of experience  
* expected salary fit  
* domicile fit  
* portfolio/linkedin availability  
* job-specific screening questions

### **Acceptance Criteria**

* Score is stored correctly when enabled  
* No score is assigned if scoring feature is disabled

---

## **15.9 Plan Limit Management**

### **Description**

MVP should support simple subscription logic such as limiting active jobs by plan.

### **Functional Requirements**

1. System must store company plan and max active jobs  
2. System must prevent publishing more than allowed number of active jobs  
3. System must show clear message when limit is reached

### **Acceptance Criteria**

* Client cannot exceed active job limit  
* Active job count updates correctly when jobs are archived or expired

---

## **15.10 Basic Onboarding and Configuration**

### **Description**

Each client requires setup for branding, storage destinations, and hiring page content.

### **Functional Requirements**

1. System/admin must be able to configure company name, logo, brand colors, and intro text  
2. System/admin must be able to link company Google Drive folder and Google Sheet  
3. System/admin must be able to create initial job entries  
4. System/admin must be able to activate or deactivate the company page

### **Acceptance Criteria**

* Company page reflects onboarding data correctly  
* Candidate submissions route to the correct company storage

---

## **16\. Data Structure**

### **16.1 Core Sheet Tabs**

#### **A. Company\_Config**

Suggested columns:

* company\_id  
* company\_name  
* company\_slug  
* logo\_url  
* primary\_color  
* secondary\_color  
* contact\_email  
* whatsapp\_number  
* active\_plan  
* max\_active\_jobs  
* drive\_root\_folder\_id  
* allow\_file\_upload  
* site\_status

#### **B. Jobs**

Suggested columns:

* job\_id  
* company\_id  
* job\_title  
* department  
* location  
* employment\_type  
* min\_salary  
* max\_salary  
* description  
* requirements  
* status  
* created\_at  
* expired\_at  
* folder\_id  
* sort\_order

#### **C. Candidates**

Suggested columns:

* candidate\_id  
* applied\_at  
* company\_id  
* job\_id  
* job\_title  
* full\_name  
* email  
* phone  
* city  
* linkedin\_url  
* portfolio\_url  
* experience\_summary  
* expected\_salary  
* cv\_file\_name  
* cv\_file\_url  
* cover\_letter  
* screening\_score  
* reviewer\_note  
* status  
* reviewed\_by

#### **D. Form\_Logs**

Suggested columns:

* log\_id  
* timestamp  
* company\_id  
* job\_id  
* submit\_status  
* file\_upload\_status  
* error\_message

---

## **17\. System Flow**

### **17.1 Candidate Application Flow**

1. Candidate visits company microsite  
2. Candidate selects a job  
3. Candidate opens job detail page  
4. Candidate clicks apply  
5. Candidate fills in form and uploads CV  
6. Frontend sends form submission to Apps Script endpoint  
7. Apps Script validates request and job status  
8. CV is uploaded to Google Drive job folder  
9. Candidate data is inserted into Google Sheets  
10. Frontend receives success response and shows confirmation page

### **17.2 Admin/Client Review Flow**

1. Client opens the recruitment Google Sheet  
2. Client reviews new candidates  
3. Client opens CV link from the sheet  
4. Client updates status manually in the sheet  
5. Client continues own offline recruitment process

---

## **18\. Functional User Stories**

### **Company Admin**

1. As a company admin, I want a branded career page so that my business looks professional when hiring  
2. As a company admin, I want to publish multiple open jobs so that candidates can browse available positions  
3. As a company admin, I want candidate applications to be stored in Google Sheets so that I can review them easily  
4. As a company admin, I want CV files to be stored in Google Drive so that all documents are organized  
5. As a company admin, I want to track candidate status in a familiar tool so that I do not need to learn an ATS

### **Candidate**

1. As a candidate, I want to see a clear list of available jobs so that I can find suitable opportunities  
2. As a candidate, I want to read job requirements before applying so that I know whether I fit the role  
3. As a candidate, I want a simple form so that I can apply quickly from my phone  
4. As a candidate, I want confirmation after submission so that I know my application was received

---

## **19\. Non-Functional Requirements**

### **Performance**

* Public pages should load quickly on mobile networks  
* Form submission should complete reliably for standard CV file sizes

### **Availability**

* Public pages should be accessible continuously except scheduled maintenance  
* System must fail gracefully if Google service connection is unavailable

### **Security**

* Candidate data must be stored only in the intended client storage destination  
* Public users must not gain access to Google Sheets or Google Drive internals  
* File upload rules must prevent unsupported file types

### **Usability**

* Career pages must be mobile-first  
* Application form should be short and clear  
* Admin operation should remain simple and spreadsheet-friendly

### **Scalability**

* MVP is designed for low to moderate hiring volume per client  
* Architecture is not intended for enterprise-scale hiring in v1

---

## **20\. Risks and Mitigations**

| Risk | Impact | Mitigation |
| ----- | ----- | ----- |
| Apps Script quota limitation | Submission failure under high volume | Limit target segment to small businesses and low hiring volume |
| Google account permission confusion | Onboarding friction | Create guided onboarding and template-based setup |
| Storage limit on free Google account | CV upload interruptions | Restrict file size and recommend cleanup/archive process |
| File upload errors | Poor candidate experience | Add clear validation and submission error handling |
| Clients expect ATS-level features | Product mismatch | Position product clearly as lightweight recruitment microsite |
| Multi-tenant configuration mistakes | Data misrouting risk | Isolate company config and storage carefully |

---

## **21\. Dependencies**

### **Internal Dependencies**

* Frontend microsite framework/template  
* Apps Script backend logic  
* Configuration templates for Google Sheets and Google Drive  
* Subdomain provisioning workflow

### **External Dependencies**

* Google Drive availability  
* Google Sheets availability  
* Google Apps Script web app deployment  
* DNS/subdomain configuration  
* Static hosting provider

---

## **22\. Pricing Assumption for MVP**

### **Example Packaging**

#### **Starter**

* Subdomain under wehire  
* Up to 3 active jobs  
* Basic branded page  
* Candidate storage to Sheets and Drive

#### **Basic**

* Up to 5 active jobs  
* Branded page with better customization  
* Basic scoring  
* Email confirmation

#### **Pro**

* Up to 10 active jobs  
* Enhanced page sections  
* Better onboarding support

Note: Pricing is subject to separate business validation and is not part of core MVP requirements.

---

## **23\. MVP Release Criteria**

MVP can be considered ready for launch when:

1. At least one company microsite can be created successfully  
2. Active jobs can be displayed publicly  
3. Candidates can apply successfully via form  
4. CV upload works reliably within size/type limits  
5. Candidate data is saved correctly to Google Sheets  
6. CV file is saved correctly to Google Drive  
7. Basic status tracking works through Google Sheets  
8. Mobile user experience is acceptable for public pages and form submission

---

## **24\. Open Questions**

1. Will each client have a dedicated Apps Script deployment or shared logic layer?  
2. Will onboarding be manual first or self-serve from the start?  
3. How will company branding assets be stored and managed?  
4. Should email confirmation be included in MVP or Phase 2?  
5. What is the exact plan limit structure for commercial launch?  
6. Will duplicate candidate detection be needed in MVP?  
7. Should expired jobs be archived automatically?

---

## **25\. Recommended Phase Roadmap**

### **Phase 1 \- Single Company Prototype**

* One microsite  
* One job listing  
* One application form  
* One Google Sheet  
* One Google Drive folder structure

### **Phase 2 \- Reusable Client Template**

* Company configuration layer  
* Multiple jobs  
* Dynamic branding  
* Basic status tracking

### **Phase 3 \- Multi-Company MVP**

* Subdomain per company  
* Plan-based active job limits  
* Better onboarding

### **Phase 4 \- Post-MVP Enhancements**

* Email confirmation  
* Better scoring  
* Candidate deduplication  
* Client analytics  
* Lightweight recruiter dashboard

---

## **26\. Final Recommendation**

The MVP should prioritize reliability, simplicity, and fast go-live over advanced recruitment workflow features. The strongest value proposition is not complex automation, but a professional hiring presence combined with simple candidate collection in tools the client already understands.

WeHire should launch first as a **career microsite and applicant intake product**, then evolve into a more structured recruitment operations tool only after validating demand, onboarding success, and user retention.

