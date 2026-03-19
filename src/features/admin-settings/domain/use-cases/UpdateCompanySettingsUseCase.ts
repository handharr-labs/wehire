import { type SiteStatus } from '@/features/career-microsite/domain/entities/Company';
import { type CompanySettingsRepository } from '../repositories/CompanySettingsRepository';

export interface CompanySettingsInput {
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  contactEmail: string;
  whatsappNumber: string;
  siteStatus: SiteStatus;
}

export interface UpdateCompanySettingsUseCase {
  execute(companyId: string, input: CompanySettingsInput): Promise<void>;
}

export class UpdateCompanySettingsUseCaseImpl implements UpdateCompanySettingsUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(companyId: string, input: CompanySettingsInput): Promise<void> {
    return this.repository.update(companyId, input);
  }
}
