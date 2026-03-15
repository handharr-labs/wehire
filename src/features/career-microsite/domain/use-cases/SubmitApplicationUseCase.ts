import { type ApplicationPayload } from '../entities/ApplicationPayload';
import { type ApplicationRepository } from '../repositories/ApplicationRepository';

export interface SubmitApplicationUseCase {
  execute(payload: ApplicationPayload): Promise<void>;
}

export class SubmitApplicationUseCaseImpl implements SubmitApplicationUseCase {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  execute(payload: ApplicationPayload): Promise<void> {
    return this.applicationRepository.submit(payload);
  }
}
