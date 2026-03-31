import { type Job } from '@/features/career-microsite/domain/entities/Job';

export interface CreateJobInput {
  readonly companyId: string;
  readonly title: string;
  readonly department: string;
  readonly location: string;
  readonly employmentType: string;
  readonly minSalary: number;
  readonly maxSalary: number;
  readonly description: string;
  readonly requirements: string;
  readonly status: string;
  readonly expiredAt: string;
  readonly sortOrder: number;
}

export interface UpdateJobInput {
  readonly title?: string;
  readonly department?: string;
  readonly location?: string;
  readonly employmentType?: string;
  readonly minSalary?: number;
  readonly maxSalary?: number;
  readonly description?: string;
  readonly requirements?: string;
  readonly status?: string;
  readonly expiredAt?: string;
  readonly sortOrder?: number;
}

export interface JobManagementRepository {
  getByCompanyId(companyId: string): Promise<Job[]>;
  getById(jobId: string, companyId: string): Promise<Job>;
  create(input: CreateJobInput): Promise<{ id: string }>;
  update(jobId: string, companyId: string, input: UpdateJobInput): Promise<void>;
  delete(jobId: string, companyId: string): Promise<void>;
}
