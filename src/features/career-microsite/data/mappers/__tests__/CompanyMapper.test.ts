import { describe, it, expect } from 'vitest';
import { CompanyMapper } from '../CompanyMapper';
import { type CompanyDTO } from '../../dtos/CompanyDTO';

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

describe('CompanyMapper.toDomain', () => {
  it('maps all snake_case DTO fields to camelCase entity', () => {
    const company = CompanyMapper.toDomain(baseDTO);
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
    });
  });

  it('falls back siteStatus to "inactive" when site_status is absent', () => {
    const dto = { ...baseDTO, site_status: undefined as unknown as string };
    const company = CompanyMapper.toDomain(dto);
    expect(company.siteStatus).toBe('inactive');
  });
});
