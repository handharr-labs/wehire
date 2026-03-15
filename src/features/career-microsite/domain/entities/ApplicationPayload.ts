export interface ApplicationPayload {
  jobId: string;
  companyId: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  experienceSummary: string;
  expectedSalary: number;
  cvFile: File;
  linkedinUrl?: string;
  portfolioUrl?: string;
  coverLetter?: string;
}
