import 'server-only';

import { createSafeActionClient } from 'next-safe-action';
import { cookies } from 'next/headers';
import { DomainError } from '@/shared/domain/errors/DomainError';
// Intentionally coupled to admin session — this project has a single auth context.
// If non-admin server actions are ever needed, extract session-getter as an injected dependency.
import { getAdminSession, type AdminSessionPayload } from './session';

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof DomainError && error.code === 'unauthorized') {
      return 'Invalid email or password.';
    }
    if (error instanceof DomainError) {
      return error.message;
    }
    return 'An unexpected error occurred.';
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const cookieStore = await cookies();
  const session: AdminSessionPayload | null = await getAdminSession(cookieStore);

  if (!session) {
    throw DomainError.unauthorized();
  }

  return next({ ctx: { session } });
});
