import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { type CompanySettingsRepository } from '../repositories/CompanySettingsRepository';

export interface ListCompaniesUseCase {
  execute(): Promise<Company[]>;
}

export class ListCompaniesUseCaseImpl implements ListCompaniesUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(): Promise<Company[]> {
    return this.repository.getAll();
  }
}
