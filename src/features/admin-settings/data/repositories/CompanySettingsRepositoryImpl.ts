import { type Company } from '@/shared/domain/entities/Company';
import { type CompanyMapper } from '@/shared/data/mappers/CompanyMapper';
import { type AppsScriptDataSource } from '@/data/data-sources/AppsScriptDataSource';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';
import { type CompanySettingsRepository } from '../../domain/repositories/CompanySettingsRepository';
import { type CompanySettingsInput } from '../../domain/entities/CompanySettingsInput';

export class CompanySettingsRepositoryImpl implements CompanySettingsRepository {
  constructor(
    private readonly dataSource: AppsScriptDataSource,
    private readonly mapper: CompanyMapper,
    private readonly errorMapper: ErrorMapper,
  ) {}

  async getAll(): Promise<Company[]> {
    try {
      const dtos = await this.dataSource.getCompanies();
      return dtos.map((dto) => this.mapper.toDomain(dto));
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async getById(companyId: string): Promise<Company> {
    try {
      const dto = await this.dataSource.getCompanyById(companyId);
      return this.mapper.toDomain(dto);
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
