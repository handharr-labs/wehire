import { describe, it, expect, vi } from 'vitest';
import { AdminRepositoryImpl } from '../AdminRepositoryImpl';
import { type AdminDataSource } from '../../data-sources/AdminDataSource';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type AdminDTO } from '../../dtos/AdminDTO';
import { DomainError } from '@/shared/domain/errors/DomainError';
import { NetworkError } from '@/data/networking/NetworkError';

const dto: AdminDTO = {
  admin_id: 'a1',
  email: 'admin@example.com',
  hashed_password: '$2b$10$hash',
  role: 'SUPER_ADMIN',
  company_id: null,
};

function makeDataSource(result: AdminDTO | null): AdminDataSource {
  return { findAdminByEmail: vi.fn().mockResolvedValue(result) } as unknown as AdminDataSource;
}

const errorMapper: ErrorMapper = {
  toDomain: (err: NetworkError) => DomainError.serverError(err.message),
};

describe('AdminRepositoryImpl.findByEmail', () => {
  it('returns mapped Admin entity when DTO is found', async () => {
    const repo = new AdminRepositoryImpl(makeDataSource(dto), errorMapper);
    const admin = await repo.findByEmail('admin@example.com');

    expect(admin).not.toBeNull();
    expect(admin?.adminId).toBe('a1');
    expect(admin?.email).toBe('admin@example.com');
    expect(admin?.role).toBe('SUPER_ADMIN');
    expect(admin?.companyId).toBeNull();
  });

  it('returns null when data source returns null', async () => {
    const repo = new AdminRepositoryImpl(makeDataSource(null), errorMapper);
    const admin = await repo.findByEmail('unknown@example.com');

    expect(admin).toBeNull();
  });

  it('maps network errors to domain errors', async () => {
    const failingDataSource = {
      findAdminByEmail: vi.fn().mockRejectedValue(new NetworkError('httpError', 'HTTP 500', 500)),
    } as unknown as AdminDataSource;

    const repo = new AdminRepositoryImpl(failingDataSource, errorMapper);

    await expect(repo.findByEmail('admin@example.com')).rejects.toBeInstanceOf(DomainError);
  });
});
