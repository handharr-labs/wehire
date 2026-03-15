import { type Job } from '../entities/Job';

export interface JobRepository {
  getByCompanyId(companyId: string): Promise<Job[]>;
  getById(jobId: string): Promise<Job>;
}
