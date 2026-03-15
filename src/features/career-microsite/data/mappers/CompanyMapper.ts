import { type Company, type SiteStatus } from '../../domain/entities/Company';
import { type CompanyDTO } from '../dtos/CompanyDTO';

export class CompanyMapper {
  static toDomain(dto: CompanyDTO): Company {
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
