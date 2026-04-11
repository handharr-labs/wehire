export interface ApplicationPayload {
  readonly jobId: string;
  readonly companyId: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly city: string;
  readonly experienceSummary: string;
  readonly expectedSalary: number;
  readonly cvBase64: string;
  readonly cvFileName: string;
  readonly cvFileMime: string;
  readonly linkedinUrl?: string;
  readonly portfolioUrl?: string;
  readonly coverLetter?: string;
  readonly screeningScore?: number | null;
  readonly customFields?: Record<string, string | number>;
}
