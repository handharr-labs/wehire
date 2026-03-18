import { type ApplicationPayload } from '../entities/ApplicationPayload';
import { type ApplicationRepository } from '../repositories/ApplicationRepository';
import { type GetJobDetailUseCase } from './GetJobDetailUseCase';
import { isJobOpen } from '../helpers/isJobOpen';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface SubmitApplicationUseCase {
  execute(payload: ApplicationPayload): Promise<void>;
}

export class SubmitApplicationUseCaseImpl implements SubmitApplicationUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly getJobDetailUseCase: GetJobDetailUseCase,
  ) {}

  async execute(payload: ApplicationPayload): Promise<void> {
    const job = await this.getJobDetailUseCase.execute(payload.jobId);
    if (!isJobOpen(job)) {
      throw DomainError.validationFailed('job', 'inactive or expired');
    }
    return this.applicationRepository.submit(payload);
  }
}
