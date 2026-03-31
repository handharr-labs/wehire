import { type CompanySettingsInput } from '../entities/CompanySettingsInput';
import { type CompanySettingsRepository } from '../repositories/CompanySettingsRepository';

export type { CompanySettingsInput };

export interface UpdateCompanySettingsUseCase {
  execute(companyId: string, input: CompanySettingsInput): Promise<void>;
}

export class UpdateCompanySettingsUseCaseImpl implements UpdateCompanySettingsUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(companyId: string, input: CompanySettingsInput): Promise<void> {
    return this.repository.update(companyId, input);
  }
}
