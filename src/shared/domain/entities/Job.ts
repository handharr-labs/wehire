export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type JobStatus = 'active' | 'closed' | 'draft';

export interface Job {
  readonly id: string;
  readonly companyId: string;
  readonly title: string;
  readonly department: string;
  readonly location: string;
  readonly employmentType: EmploymentType;
  readonly minSalary: number;
  readonly maxSalary: number;
  readonly description: string;
  readonly requirements: string;
  readonly status: JobStatus;
  readonly expiredAt: string;
  readonly sortOrder: number;
  readonly targetCity?: string;
}
