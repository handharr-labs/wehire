import 'server-only';

import { createSafeActionClient } from 'next-safe-action';
import { cookies } from 'next/headers';
import { DomainError } from '@/shared/domain/errors/DomainError';
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
