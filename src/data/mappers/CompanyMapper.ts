import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { type CompanyDTO } from '@/data/dtos/CompanyDTO';

export interface CompanyMapper {
  toDomain(dto: CompanyDTO): Company;
}
