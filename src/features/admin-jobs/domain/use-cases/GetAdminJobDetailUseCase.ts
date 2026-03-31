import { type Job } from '@/features/career-microsite/domain/entities/Job';
import { type JobManagementRepository } from '../repositories/JobManagementRepository';

export interface GetAdminJobDetailUseCase {
  execute(jobId: string, companyId: string): Promise<Job>;
}

export class GetAdminJobDetailUseCaseImpl implements GetAdminJobDetailUseCase {
  constructor(private readonly repository: JobManagementRepository) {}

  execute(jobId: string, companyId: string): Promise<Job> {
    return this.repository.getById(jobId, companyId);
  }
}
