import { type Job } from '@/shared/domain/entities/Job';
import { type JobRepository } from '../repositories/JobRepository';

export interface GetJobDetailUseCase {
  execute(jobId: string, companyId: string): Promise<Job>;
}

export class GetJobDetailUseCaseImpl implements GetJobDetailUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  execute(jobId: string, companyId: string): Promise<Job> {
    return this.jobRepository.getById(jobId, companyId);
  }
}
