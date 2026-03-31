import { type CreateJobInput, type JobManagementRepository } from '../repositories/JobManagementRepository';

export interface CreateJobUseCase {
  execute(input: CreateJobInput): Promise<{ id: string }>;
}

export class CreateJobUseCaseImpl implements CreateJobUseCase {
  constructor(private readonly repository: JobManagementRepository) {}

  execute(input: CreateJobInput): Promise<{ id: string }> {
    return this.repository.create(input);
  }
}
