import { type Company } from '../entities/Company';

export interface CompanyRepository {
  getBySlug(slug: string): Promise<Company>;
}
