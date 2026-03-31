import { describe, it, expect } from 'vitest';
import { AdminMapperImpl } from '../AdminMapper';
import { type AdminDTO } from '../../dtos/AdminDTO';

describe('AdminMapperImpl.toDomain', () => {
  it('maps snake_case fields to camelCase', () => {
    const mapper = new AdminMapperImpl();
    const dto: AdminDTO = {
      admin_id: 'a1',
      email: 'admin@example.com',
      hashed_password: '$2b$10$hash',
      role: 'SUPER_ADMIN',
      company_id: null,
    };

    const admin = mapper.toDomain(dto);

    expect(admin.adminId).toBe('a1');
    expect(admin.email).toBe('admin@example.com');
    expect(admin.hashedPassword).toBe('$2b$10$hash');
    expect(admin.role).toBe('SUPER_ADMIN');
    expect(admin.companyId).toBeNull();
  });

  it('maps company_id when present', () => {
    const mapper = new AdminMapperImpl();
    const dto: AdminDTO = {
      admin_id: 'a2',
      email: 'company@example.com',
      hashed_password: '$2b$10$hash',
      role: 'COMPANY_ADMIN',
      company_id: 'company-1',
    };

    const admin = mapper.toDomain(dto);

    expect(admin.companyId).toBe('company-1');
    expect(admin.role).toBe('COMPANY_ADMIN');
  });

  it('coerces empty string company_id to null', () => {
    const mapper = new AdminMapperImpl();
    const dto: AdminDTO = {
      admin_id: 'a3',
      email: 'super@example.com',
      hashed_password: '$2b$10$hash',
      role: 'SUPER_ADMIN',
      company_id: '' as unknown as null,
    };

    const admin = mapper.toDomain(dto);
    expect(admin.companyId).toBeNull();
  });
});
