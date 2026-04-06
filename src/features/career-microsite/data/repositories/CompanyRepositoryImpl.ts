import { type Company } from '@/shared/domain/entities/Company';
import { type CompanyRepository } from '@/shared/domain/repositories/CompanyRepository';
import { type AppsScriptDataSource } from '@/data/data-sources/AppsScriptDataSource';
import { type CompanyMapper } from '@/shared/data/mappers/CompanyMapper';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';

export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(
    private readonly dataSource: AppsScriptDataSource,
    private readonly mapper: CompanyMapper,
    private readonly errorMapper: ErrorMapper,
  ) {}

  async getBySlug(slug: string): Promise<Company> {
    try {
      const dto = await this.dataSource.getCompanyBySlug(slug);
      return this.mapper.toDomain(dto);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }
}
