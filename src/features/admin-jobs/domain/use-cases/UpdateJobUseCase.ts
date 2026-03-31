import { type UpdateJobInput, type JobManagementRepository } from '../repositories/JobManagementRepository';

export interface UpdateJobUseCase {
  execute(jobId: string, companyId: string, input: UpdateJobInput): Promise<void>;
}

export class UpdateJobUseCaseImpl implements UpdateJobUseCase {
  constructor(private readonly repository: JobManagementRepository) {}

  execute(jobId: string, companyId: string, input: UpdateJobInput): Promise<void> {
    return this.repository.update(jobId, companyId, input);
  }
}
