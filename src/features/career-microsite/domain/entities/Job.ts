export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type JobStatus = 'active' | 'closed' | 'draft';

export interface Job {
  id: string;
  companyId: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  minSalary: number;
  maxSalary: number;
  description: string;
  requirements: string;
  status: JobStatus;
  expiredAt: string;
  sortOrder: number;
}
