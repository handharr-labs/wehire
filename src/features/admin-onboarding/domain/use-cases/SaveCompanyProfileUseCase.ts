import { type CompanySettingsRepository } from '@/shared/domain/repositories/CompanySettingsRepository';

export interface SaveCompanyProfileInput {
  readonly name: string;
  readonly logoUrl: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly contactEmail: string;
  readonly whatsappNumber: string;
}

export interface SaveCompanyProfileUseCase {
  execute(companyId: string, profile: SaveCompanyProfileInput): Promise<void>;
}

export class SaveCompanyProfileUseCaseImpl implements SaveCompanyProfileUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  async execute(companyId: string, profile: SaveCompanyProfileInput): Promise<void> {
    const existing = await this.repository.getById(companyId);
    await this.repository.update(companyId, {
      name: profile.name,
      logoUrl: profile.logoUrl,
      primaryColor: profile.primaryColor,
      secondaryColor: profile.secondaryColor,
      description: existing.description,
      contactEmail: profile.contactEmail,
      whatsappNumber: profile.whatsappNumber,
      siteStatus: existing.siteStatus,
      scoringEnabled: existing.scoringEnabled,
    });
  }
}
