import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { type AdminRole } from '@/features/admin-auth/domain/entities/Admin';

export const SESSION_COOKIE_NAME = 'admin_session';

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/admin',
  maxAge: 60 * 60 * 8, // 8 hours in seconds
};

export interface AdminSessionPayload {
  sub: string;
  email: string;
  role: AdminRole;
  companyId: string | null;
  iat?: number;
  exp?: number;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error('ADMIN_JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getJwtSecret());
}

export async function verifySession(token: string): Promise<AdminSessionPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload as unknown as AdminSessionPayload;
}

export async function getAdminSession(
  cookieStore: ReadonlyRequestCookies,
): Promise<AdminSessionPayload | null> {
  try {
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!cookie?.value) return null;
    return await verifySession(cookie.value);
  } catch {
    return null;
  }
}
