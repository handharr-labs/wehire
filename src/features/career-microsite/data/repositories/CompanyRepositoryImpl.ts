import { type Company } from '../../domain/entities/Company';
import { type CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { type AppsScriptDataSource } from '../data-sources/AppsScriptDataSource';
import { CompanyMapper } from '../mappers/CompanyMapper';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';

export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(
    private readonly dataSource: AppsScriptDataSource,
    private readonly errorMapper: ErrorMapper,
  ) {}

  async getBySlug(slug: string): Promise<Company> {
    try {
      const dto = await this.dataSource.getCompanyBySlug(slug);
      return CompanyMapper.toDomain(dto);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }
}
