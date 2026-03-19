import { type CreateJobInput, type IJobManagementRepository } from '../repositories/IJobManagementRepository';

export interface CreateJobUseCase {
  execute(input: CreateJobInput): Promise<{ id: string }>;
}

export class CreateJobUseCaseImpl implements CreateJobUseCase {
  constructor(private readonly repository: IJobManagementRepository) {}

  execute(input: CreateJobInput): Promise<{ id: string }> {
    return this.repository.create(input);
  }
}
