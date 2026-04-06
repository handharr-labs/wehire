import { type CompanyRepository } from '@/shared/domain/repositories/CompanyRepository';

export interface VerifyCompanyConnectionUseCase {
  execute(slug: string): Promise<boolean>;
}

export class VerifyCompanyConnectionUseCaseImpl implements VerifyCompanyConnectionUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(slug: string): Promise<boolean> {
    try {
      await this.companyRepository.getBySlug(slug);
      return true;
    } catch {
      return false;
    }
  }
}
