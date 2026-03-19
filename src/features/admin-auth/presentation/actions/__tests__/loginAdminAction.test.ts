import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DomainError } from '@/shared/domain/errors/DomainError';

// Mock server-only modules
vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  }),
}));

vi.mock('@/lib/session', () => ({
  signSession: vi.fn().mockResolvedValue('mock-jwt-token'),
  SESSION_COOKIE_NAME: 'admin_session',
  SESSION_COOKIE_OPTIONS: { httpOnly: true },
}));

const mockExecute = vi.fn();
vi.mock('@/di/container.server', () => ({
  loginAdminUseCase: () => ({ execute: mockExecute }),
}));

describe('loginAdminAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_JWT_SECRET = 'test-secret-that-is-at-least-32-chars!!';
  });

  it('sets cookie and returns role on success', async () => {
    mockExecute.mockResolvedValue({
      sub: 'admin-1',
      email: 'admin@example.com',
      role: 'SUPER_ADMIN',
      companyId: null,
    });

    const { loginAdminAction } = await import('../loginAdminAction');
    const result = await loginAdminAction({ email: 'admin@example.com', password: 'secret' });

    expect(result?.data?.role).toBe('SUPER_ADMIN');
    expect(result?.data?.companyId).toBeNull();
  });

  it('returns serverError for DomainError.unauthorized', async () => {
    mockExecute.mockRejectedValue(DomainError.unauthorized());

    const { loginAdminAction } = await import('../loginAdminAction');
    const result = await loginAdminAction({ email: 'admin@example.com', password: 'wrong' });

    expect(result?.serverError).toBe('Invalid email or password.');
    expect(result?.data).toBeUndefined();
  });

  it('returns validation errors for invalid email', async () => {
    const { loginAdminAction } = await import('../loginAdminAction');
    const result = await loginAdminAction({ email: 'not-an-email', password: 'secret' });

    expect(result?.validationErrors).toBeDefined();
  });

  it('does not set cookie when action fails', async () => {
    mockExecute.mockRejectedValue(DomainError.unauthorized());

    const { cookies } = await import('next/headers');
    const mockCookieStore = { set: vi.fn(), get: vi.fn(), delete: vi.fn() };
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as never);

    const { loginAdminAction } = await import('../loginAdminAction');
    await loginAdminAction({ email: 'admin@example.com', password: 'wrong' });

    expect(mockCookieStore.set).not.toHaveBeenCalled();
  });
});
