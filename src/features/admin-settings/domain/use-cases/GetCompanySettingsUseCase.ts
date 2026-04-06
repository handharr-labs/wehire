import { type Company } from '@/shared/domain/entities/Company';
import { type CompanySettingsRepository } from '../repositories/CompanySettingsRepository';

export interface GetCompanySettingsUseCase {
  execute(companyId: string): Promise<Company>;
}

export class GetCompanySettingsUseCaseImpl implements GetCompanySettingsUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(companyId: string): Promise<Company> {
    return this.repository.getById(companyId);
  }
}
