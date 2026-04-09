import { type Company } from '@/shared/domain/entities/Company';
import { type CompanySettingsRepository } from '@/shared/domain/repositories/CompanySettingsRepository';

export interface ListCompaniesUseCase {
  execute(): Promise<Company[]>;
}

export class ListCompaniesUseCaseImpl implements ListCompaniesUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(): Promise<Company[]> {
    return this.repository.getAll();
  }
}
