import { type Job } from '@/features/career-microsite/domain/entities/Job';
import { type IJobManagementRepository } from '../repositories/IJobManagementRepository';

export interface GetAdminJobsUseCase {
  execute(companyId: string): Promise<Job[]>;
}

export class GetAdminJobsUseCaseImpl implements GetAdminJobsUseCase {
  constructor(private readonly repository: IJobManagementRepository) {}

  execute(companyId: string): Promise<Job[]> {
    return this.repository.getByCompanyId(companyId);
  }
}
