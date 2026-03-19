import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { CompanyMapper } from '@/features/career-microsite/data/mappers/CompanyMapper';
import { type AppsScriptDataSource } from '@/features/career-microsite/data/data-sources/AppsScriptDataSource';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';
import { type CompanySettingsRepository } from '../../domain/repositories/CompanySettingsRepository';
import { type CompanySettingsInput } from '../../domain/use-cases/UpdateCompanySettingsUseCase';

export class CompanySettingsRepositoryImpl implements CompanySettingsRepository {
  constructor(
    private readonly dataSource: AppsScriptDataSource,
    private readonly errorMapper: ErrorMapper,
  ) {}

  async getAll(): Promise<Company[]> {
    try {
      const dtos = await this.dataSource.getCompanies();
      return dtos.map(CompanyMapper.toDomain);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async getById(companyId: string): Promise<Company> {
    try {
      const dto = await this.dataSource.getCompanyById(companyId);
      return CompanyMapper.toDomain(dto);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async update(companyId: string, input: CompanySettingsInput): Promise<void> {
    try {
      await this.dataSource.updateCompany(companyId, {
        name: input.name,
        logo_url: input.logoUrl,
        primary_color: input.primaryColor,
        secondary_color: input.secondaryColor,
        description: input.description,
        contact_email: input.contactEmail,
        whatsapp_number: input.whatsappNumber,
        site_status: input.siteStatus,
      });
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }
}
