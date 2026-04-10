import { type ApplicationPayload } from '@/shared/domain/entities/ApplicationPayload';
import { type Company } from '@/shared/domain/entities/Company';
import { type ApplicationRepository } from '../repositories/ApplicationRepository';
import { type GetJobDetailUseCase } from './GetJobDetailUseCase';
import { type ApplicantScoringService } from '../services/ApplicantScoringService';
import { isJobOpen } from '../helpers/isJobOpen';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface SubmitApplicationUseCase {
  execute(payload: ApplicationPayload, company: Company): Promise<void>;
}

export class SubmitApplicationUseCaseImpl implements SubmitApplicationUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly getJobDetailUseCase: GetJobDetailUseCase,
    private readonly scoringService: ApplicantScoringService,
  ) {}

  async execute(payload: ApplicationPayload, company: Company): Promise<void> {
    const job = await this.getJobDetailUseCase.execute(payload.jobId, payload.companyId);
    if (!isJobOpen(job, new Date())) {
      throw DomainError.validationFailed('job', 'inactive or expired');
    }

    const screeningScore = this.scoringService.score({
      payload,
      job,
      scoringEnabled: company.scoringEnabled,
    });

    return this.applicationRepository.submit({ ...payload, screeningScore });
  }
}
