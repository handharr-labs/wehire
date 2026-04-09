import { type CompanySettingsRepository } from '@/shared/domain/repositories/CompanySettingsRepository';

export interface LaunchCompanyUseCase {
  execute(companyId: string): Promise<void>;
}

export class LaunchCompanyUseCaseImpl implements LaunchCompanyUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  async execute(companyId: string): Promise<void> {
    const company = await this.repository.getById(companyId);
    await this.repository.update(companyId, {
      name: company.name,
      logoUrl: company.logoUrl,
      primaryColor: company.primaryColor,
      secondaryColor: company.secondaryColor,
      description: company.description,
      contactEmail: company.contactEmail,
      whatsappNumber: company.whatsappNumber,
      siteStatus: 'active',
    });
  }
}
