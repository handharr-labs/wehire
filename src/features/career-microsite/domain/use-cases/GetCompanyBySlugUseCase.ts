import { type Company } from '@/shared/domain/entities/Company';
import { type CompanyRepository } from '@/shared/domain/repositories/CompanyRepository';

export interface GetCompanyBySlugUseCase {
  execute(slug: string): Promise<Company>;
}

export class GetCompanyBySlugUseCaseImpl implements GetCompanyBySlugUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  execute(slug: string): Promise<Company> {
    return this.companyRepository.getBySlug(slug);
  }
}
