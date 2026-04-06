import { type Company } from '@/shared/domain/entities/Company';
import { type CompanySettingsInput } from '../entities/CompanySettingsInput';

export interface CompanySettingsRepository {
  getAll(): Promise<Company[]>;
  getById(companyId: string): Promise<Company>;
  update(companyId: string, data: CompanySettingsInput): Promise<void>;
}
