import { type IJobManagementRepository } from '../repositories/IJobManagementRepository';

export interface DeleteJobUseCase {
  execute(jobId: string, companyId: string): Promise<void>;
}

export class DeleteJobUseCaseImpl implements DeleteJobUseCase {
  constructor(private readonly repository: IJobManagementRepository) {}

  execute(jobId: string, companyId: string): Promise<void> {
    return this.repository.delete(jobId, companyId);
  }
}
