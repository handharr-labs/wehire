import { type Job } from '@/features/career-microsite/domain/entities/Job';
import { type IJobManagementRepository } from '../repositories/IJobManagementRepository';

export interface GetAdminJobDetailUseCase {
  execute(jobId: string, companyId: string): Promise<Job>;
}

export class GetAdminJobDetailUseCaseImpl implements GetAdminJobDetailUseCase {
  constructor(private readonly repository: IJobManagementRepository) {}

  execute(jobId: string, companyId: string): Promise<Job> {
    return this.repository.getById(jobId, companyId);
  }
}
