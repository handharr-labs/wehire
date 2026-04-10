import { type ApplicationPayload } from '@/shared/domain/entities/ApplicationPayload';
import { type ApplicationRepository } from '../../domain/repositories/ApplicationRepository';
import { type AppsScriptDataSource } from '@/data/data-sources/AppsScriptDataSource';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';

export class ApplicationRepositoryImpl implements ApplicationRepository {
  constructor(
    private readonly dataSource: AppsScriptDataSource,
    private readonly errorMapper: ErrorMapper,
  ) {}

  async submit(payload: ApplicationPayload): Promise<void> {
    const formData = new FormData();
    formData.append('jobId', payload.jobId);
    formData.append('companyId', payload.companyId);
    formData.append('fullName', payload.fullName);
    formData.append('email', payload.email);
    formData.append('phone', payload.phone);
    formData.append('city', payload.city);
    formData.append('experienceSummary', payload.experienceSummary);
    formData.append('expectedSalary', String(payload.expectedSalary));
    formData.append('cvFile', payload.cvBase64);
    formData.append('cvFileMime', payload.cvFileMime);
    formData.append('cvFileName', payload.cvFileName);
    if (payload.linkedinUrl) formData.append('linkedinUrl', payload.linkedinUrl);
    if (payload.portfolioUrl) formData.append('portfolioUrl', payload.portfolioUrl);
    if (payload.coverLetter) formData.append('coverLetter', payload.coverLetter);
    if (payload.screeningScore != null) formData.append('screeningScore', String(payload.screeningScore));

    try {
      await this.dataSource.submitApplication(formData);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }
}
