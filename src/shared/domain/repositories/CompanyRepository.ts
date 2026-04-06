import { type Company } from '@/shared/domain/entities/Company';

export interface CompanyRepository {
  getBySlug(slug: string): Promise<Company>;
}
