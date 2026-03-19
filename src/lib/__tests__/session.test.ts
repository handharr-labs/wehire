// @vitest-environment node
import { describe, it, expect, beforeAll, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { signSession, verifySession, getAdminSession, SESSION_COOKIE_NAME } from '../session';
import { type AdminSessionPayload } from '../session';

const payload: AdminSessionPayload = {
  sub: 'admin-1',
  email: 'admin@example.com',
  role: 'SUPER_ADMIN',
  companyId: null,
};

beforeAll(() => {
  process.env.ADMIN_JWT_SECRET = 'test-secret-that-is-at-least-32-chars-long!!';
});

describe('signSession / verifySession', () => {
  it('round-trips correctly', async () => {
    const token = await signSession(payload);
    const verified = await verifySession(token);

    expect(verified.sub).toBe(payload.sub);
    expect(verified.email).toBe(payload.email);
    expect(verified.role).toBe(payload.role);
    expect(verified.companyId).toBeNull();
  });

  it('throws on tampered token', async () => {
    const token = await signSession(payload);
    const tampered = token.slice(0, -5) + 'XXXXX';

    await expect(verifySession(tampered)).rejects.toThrow();
  });

  it('throws on expired token', async () => {
    // Sign with immediate expiry using a custom payload
    const { SignJWT } = await import('jose');
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
    const expiredToken = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 100)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 1)
      .sign(secret);

    await expect(verifySession(expiredToken)).rejects.toThrow();
  });
});

describe('getAdminSession', () => {
  it('returns null when cookie is missing', async () => {
    const cookieStore = { get: () => undefined } as never;
    const session = await getAdminSession(cookieStore);
    expect(session).toBeNull();
  });

  it('returns null when token is invalid', async () => {
    const cookieStore = { get: () => ({ value: 'invalid.token.here' }) } as never;
    const session = await getAdminSession(cookieStore);
    expect(session).toBeNull();
  });

  it('returns session payload when cookie is valid', async () => {
    const token = await signSession(payload);
    const cookieStore = { get: (name: string) => name === SESSION_COOKIE_NAME ? { value: token } : undefined } as never;
    const session = await getAdminSession(cookieStore);

    expect(session?.sub).toBe('admin-1');
    expect(session?.role).toBe('SUPER_ADMIN');
  });
});
