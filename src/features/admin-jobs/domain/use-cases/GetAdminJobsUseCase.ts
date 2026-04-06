import { type Job } from '@/shared/domain/entities/Job';
import { type JobManagementRepository } from '../repositories/JobManagementRepository';

export interface GetAdminJobsUseCase {
  execute(companyId: string): Promise<Job[]>;
}

export class GetAdminJobsUseCaseImpl implements GetAdminJobsUseCase {
  constructor(private readonly repository: JobManagementRepository) {}

  execute(companyId: string): Promise<Job[]> {
    return this.repository.getByCompanyId(companyId);
  }
}
