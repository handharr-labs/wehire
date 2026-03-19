import { describe, it, expect, vi } from 'vitest';
import { UpdateCompanySettingsUseCaseImpl, type CompanySettingsInput } from '../UpdateCompanySettingsUseCase';
import { type CompanySettingsRepository } from '../../repositories/CompanySettingsRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

const mockInput: CompanySettingsInput = {
  name: 'Acme Corp',
  logoUrl: 'https://example.com/logo.png',
  primaryColor: '#3B82F6',
  secondaryColor: '#6B7280',
  description: 'We do stuff.',
  contactEmail: 'hr@acme.com',
  whatsappNumber: '+6281234567890',
  siteStatus: 'active',
};

function makeRepo(overrides: Partial<CompanySettingsRepository> = {}): CompanySettingsRepository {
  return {
    getById: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('UpdateCompanySettingsUseCase', () => {
  it('calls repository.update with the correct companyId and input', async () => {
    const repo = makeRepo();
    const useCase = new UpdateCompanySettingsUseCaseImpl(repo);

    await useCase.execute('c1', mockInput);

    expect(repo.update).toHaveBeenCalledWith('c1', mockInput);
  });

  it('propagates DomainError from repository', async () => {
    const serverError = DomainError.serverError('Sheets unavailable');
    const repo = makeRepo({ update: vi.fn().mockRejectedValue(serverError) });
    const useCase = new UpdateCompanySettingsUseCaseImpl(repo);

    await expect(useCase.execute('c1', mockInput)).rejects.toThrow(serverError);
  });
});
