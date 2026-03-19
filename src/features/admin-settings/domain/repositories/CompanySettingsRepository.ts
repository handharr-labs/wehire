import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { type CompanySettingsInput } from '../use-cases/UpdateCompanySettingsUseCase';

export interface CompanySettingsRepository {
  getAll(): Promise<Company[]>;
  getById(companyId: string): Promise<Company>;
  update(companyId: string, data: CompanySettingsInput): Promise<void>;
}
