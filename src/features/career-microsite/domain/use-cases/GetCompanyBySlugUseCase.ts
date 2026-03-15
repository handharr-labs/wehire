import { type Company } from '../entities/Company';
import { type CompanyRepository } from '../repositories/CompanyRepository';

export interface GetCompanyBySlugUseCase {
  execute(slug: string): Promise<Company>;
}

export class GetCompanyBySlugUseCaseImpl implements GetCompanyBySlugUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  execute(slug: string): Promise<Company> {
    return this.companyRepository.getBySlug(slug);
  }
}
