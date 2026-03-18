import { describe, it, expect, vi } from 'vitest';
import { GetCompanyBySlugUseCaseImpl } from '../GetCompanyBySlugUseCase';
import { type CompanyRepository } from '../../repositories/CompanyRepository';
import { type Company } from '../../entities/Company';

const mockCompany: Company = {
  id: 'c1',
  name: 'Acme',
  slug: 'acme',
  logoUrl: '',
  primaryColor: '',
  secondaryColor: '',
  description: '',
  contactEmail: '',
  whatsappNumber: '',
  siteStatus: 'active',
  maxActiveJobs: 5,
};

describe('GetCompanyBySlugUseCase', () => {
  it('delegates to companyRepository.getBySlug and returns the result', async () => {
    const mockRepo = {
      getBySlug: vi.fn().mockResolvedValue(mockCompany),
    } as unknown as CompanyRepository;

    const useCase = new GetCompanyBySlugUseCaseImpl(mockRepo);
    const result = await useCase.execute('acme');

    expect(mockRepo.getBySlug).toHaveBeenCalledWith('acme');
    expect(result).toEqual(mockCompany);
  });
});
