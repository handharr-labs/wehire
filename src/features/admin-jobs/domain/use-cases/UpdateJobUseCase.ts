import { type UpdateJobInput, type IJobManagementRepository } from '../repositories/IJobManagementRepository';

export interface UpdateJobUseCase {
  execute(jobId: string, companyId: string, input: UpdateJobInput): Promise<void>;
}

export class UpdateJobUseCaseImpl implements UpdateJobUseCase {
  constructor(private readonly repository: IJobManagementRepository) {}

  execute(jobId: string, companyId: string, input: UpdateJobInput): Promise<void> {
    return this.repository.update(jobId, companyId, input);
  }
}
