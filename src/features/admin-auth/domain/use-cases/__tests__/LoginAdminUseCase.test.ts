import { describe, it, expect, vi } from 'vitest';
import { LoginAdminUseCaseImpl } from '../LoginAdminUseCase';
import { type AdminRepository } from '../../repositories/AdminRepository';
import { type PasswordVerifier } from '../../services/PasswordVerifier';
import { type Admin } from '../../entities/Admin';
import { DomainError } from '@/shared/domain/errors/DomainError';

const mockAdmin: Admin = {
  adminId: 'admin-1',
  email: 'admin@example.com',
  hashedPassword: '$2b$10$hashedpassword',
  role: 'SUPER_ADMIN',
  companyId: null,
};

function makeRepo(admin: Admin | null = mockAdmin): AdminRepository {
  return { findByEmail: vi.fn().mockResolvedValue(admin) };
}

function makeVerifier(result: boolean): PasswordVerifier {
  return { compare: vi.fn().mockResolvedValue(result) };
}

describe('LoginAdminUseCaseImpl', () => {
  it('returns session payload on valid credentials', async () => {
    const useCase = new LoginAdminUseCaseImpl(makeRepo(), makeVerifier(true));
    const payload = await useCase.execute({ email: 'admin@example.com', password: 'secret' });

    expect(payload.sub).toBe('admin-1');
    expect(payload.email).toBe('admin@example.com');
    expect(payload.role).toBe('SUPER_ADMIN');
    expect(payload.companyId).toBeNull();
  });

  it('throws unauthorized when admin not found', async () => {
    const verifier = makeVerifier(false);
    const useCase = new LoginAdminUseCaseImpl(makeRepo(null), verifier);

    await expect(useCase.execute({ email: 'unknown@example.com', password: 'secret' })).rejects.toMatchObject({
      code: 'unauthorized',
    });
  });

  it('throws unauthorized when password is wrong', async () => {
    const useCase = new LoginAdminUseCaseImpl(makeRepo(), makeVerifier(false));

    await expect(useCase.execute({ email: 'admin@example.com', password: 'wrong' })).rejects.toMatchObject({
      code: 'unauthorized',
    });
  });

  it('does not call passwordVerifier when admin is not found', async () => {
    const verifier = makeVerifier(false);
    const useCase = new LoginAdminUseCaseImpl(makeRepo(null), verifier);

    await expect(useCase.execute({ email: 'unknown@example.com', password: 'secret' })).rejects.toBeInstanceOf(DomainError);

    expect(verifier.compare).not.toHaveBeenCalled();
  });
});
