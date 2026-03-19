import { type Job } from '../entities/Job';

export interface JobRepository {
  getByCompanyId(companyId: string): Promise<Job[]>;
  getById(jobId: string, companyId: string): Promise<Job>;
  getByIdAndSlug(jobId: string, slug: string): Promise<Job>;
}
