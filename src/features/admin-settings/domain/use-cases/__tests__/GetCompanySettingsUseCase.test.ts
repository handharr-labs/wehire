import { describe, it, expect, vi } from 'vitest';
import { GetCompanySettingsUseCaseImpl } from '../GetCompanySettingsUseCase';
import { type CompanySettingsRepository } from '../../repositories/CompanySettingsRepository';
import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { DomainError } from '@/shared/domain/errors/DomainError';

const mockCompany: Company = {
  id: 'c1',
  name: 'Acme',
  slug: 'acme',
  logoUrl: '',
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  description: 'A company',
  contactEmail: 'hr@acme.com',
  whatsappNumber: '+6281234567890',
  siteStatus: 'active',
  maxActiveJobs: 5,
};

function makeRepo(overrides: Partial<CompanySettingsRepository> = {}): CompanySettingsRepository {
  return {
    getById: vi.fn().mockResolvedValue(mockCompany),
    update: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('GetCompanySettingsUseCase', () => {
  it('returns company from repository', async () => {
    const repo = makeRepo();
    const useCase = new GetCompanySettingsUseCaseImpl(repo);

    const result = await useCase.execute('c1');

    expect(repo.getById).toHaveBeenCalledWith('c1');
    expect(result).toEqual(mockCompany);
  });

  it('propagates DomainError.notFound from repository', async () => {
    const notFoundError = DomainError.notFound('Company', 'c1');
    const repo = makeRepo({ getById: vi.fn().mockRejectedValue(notFoundError) });
    const useCase = new GetCompanySettingsUseCaseImpl(repo);

    await expect(useCase.execute('c1')).rejects.toThrow(notFoundError);
  });
});
