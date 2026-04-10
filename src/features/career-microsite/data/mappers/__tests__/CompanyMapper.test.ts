import { describe, it, expect } from 'vitest';
import { CompanyMapperImpl } from '@/shared/data/mappers/CompanyMapper';
import { type CompanyDTO } from '@/shared/data/dtos/CompanyDTO';

const baseDTO: CompanyDTO = {
  id: 'c1',
  name: 'Acme Corp',
  slug: 'acme-corp',
  logo_url: 'https://example.com/logo.png',
  primary_color: '#FF0000',
  secondary_color: '#00FF00',
  description: 'A test company',
  contact_email: 'contact@acme.com',
  whatsapp_number: '+6281234567890',
  site_status: 'active',
  max_active_jobs: 10,
};

describe('CompanyMapperImpl.toDomain', () => {
  it('maps all snake_case DTO fields to camelCase entity', () => {
    const mapper = new CompanyMapperImpl();
    const company = mapper.toDomain(baseDTO);
    expect(company).toEqual({
      id: 'c1',
      name: 'Acme Corp',
      slug: 'acme-corp',
      logoUrl: 'https://example.com/logo.png',
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      description: 'A test company',
      contactEmail: 'contact@acme.com',
      whatsappNumber: '+6281234567890',
      siteStatus: 'active',
      maxActiveJobs: 10,
      scoringEnabled: false,
    });
  });

  it('falls back siteStatus to "inactive" when site_status is absent', () => {
    const mapper = new CompanyMapperImpl();
    const dto = { ...baseDTO, site_status: undefined as unknown as string };
    const company = mapper.toDomain(dto);
    expect(company.siteStatus).toBe('inactive');
  });

  it('maps scoringEnabled to true when scoring_enabled is true', () => {
    const mapper = new CompanyMapperImpl();
    const company = mapper.toDomain({ ...baseDTO, scoring_enabled: true });
    expect(company.scoringEnabled).toBe(true);
  });

  it('defaults scoringEnabled to false when scoring_enabled is absent', () => {
    const mapper = new CompanyMapperImpl();
    const company = mapper.toDomain(baseDTO);
    expect(company.scoringEnabled).toBe(false);
  });
});
