import { type Job } from '../entities/Job';
import { type JobRepository } from '../repositories/JobRepository';

export interface GetJobsUseCase {
  execute(companyId: string): Promise<Job[]>;
}

export class GetJobsUseCaseImpl implements GetJobsUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  execute(companyId: string): Promise<Job[]> {
    return this.jobRepository.getByCompanyId(companyId);
  }
}
