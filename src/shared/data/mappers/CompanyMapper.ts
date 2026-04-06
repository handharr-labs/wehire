import { type Company, type SiteStatus } from '@/shared/domain/entities/Company';
import { type CompanyDTO } from '@/data/dtos/CompanyDTO';

export interface CompanyMapper {
  toDomain(dto: CompanyDTO): Company;
}

export class CompanyMapperImpl implements CompanyMapper {
  toDomain(dto: CompanyDTO): Company {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      logoUrl: dto.logo_url,
      primaryColor: dto.primary_color,
      secondaryColor: dto.secondary_color,
      description: dto.description,
      contactEmail: dto.contact_email,
      whatsappNumber: dto.whatsapp_number,
      siteStatus: (dto.site_status as SiteStatus) ?? 'inactive',
      maxActiveJobs: dto.max_active_jobs,
    };
  }
}
