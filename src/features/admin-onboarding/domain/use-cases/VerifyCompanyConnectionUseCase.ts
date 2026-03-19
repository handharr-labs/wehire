import { type CompanyRepository } from '@/features/career-microsite/domain/repositories/CompanyRepository';

export interface VerifyCompanyConnectionUseCase {
  execute(slug: string): Promise<boolean>;
}

export class VerifyCompanyConnectionUseCaseImpl implements VerifyCompanyConnectionUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(slug: string): Promise<boolean> {
    await this.companyRepository.getBySlug(slug); // throws DomainError if not found
    return true;
  }
}
