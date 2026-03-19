import { type Job } from '../entities/Job';
import { type JobRepository } from '../repositories/JobRepository';

export interface GetJobDetailBySlugUseCase {
  execute(jobId: string, slug: string): Promise<Job>;
}

export class GetJobDetailBySlugUseCaseImpl implements GetJobDetailBySlugUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  execute(jobId: string, slug: string): Promise<Job> {
    return this.jobRepository.getByIdAndSlug(jobId, slug);
  }
}
