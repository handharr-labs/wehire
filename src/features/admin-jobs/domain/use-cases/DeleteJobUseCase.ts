import { type JobManagementRepository } from '../repositories/JobManagementRepository';

export interface DeleteJobUseCase {
  execute(jobId: string, companyId: string): Promise<void>;
}

export class DeleteJobUseCaseImpl implements DeleteJobUseCase {
  constructor(private readonly repository: JobManagementRepository) {}

  execute(jobId: string, companyId: string): Promise<void> {
    return this.repository.delete(jobId, companyId);
  }
}
