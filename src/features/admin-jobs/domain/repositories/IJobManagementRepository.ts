import { type Job } from '@/features/career-microsite/domain/entities/Job';

export interface CreateJobInput {
  companyId: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  minSalary: number;
  maxSalary: number;
  description: string;
  requirements: string;
  status: string;
  expiredAt: string;
  sortOrder: number;
}

export interface UpdateJobInput {
  title?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  minSalary?: number;
  maxSalary?: number;
  description?: string;
  requirements?: string;
  status?: string;
  expiredAt?: string;
  sortOrder?: number;
}

export interface IJobManagementRepository {
  getByCompanyId(companyId: string): Promise<Job[]>;
  getById(jobId: string, companyId: string): Promise<Job>;
  create(input: CreateJobInput): Promise<{ id: string }>;
  update(jobId: string, companyId: string, input: UpdateJobInput): Promise<void>;
  delete(jobId: string, companyId: string): Promise<void>;
}
