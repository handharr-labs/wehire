'use server';

import { cookies } from 'next/headers';
import { authActionClient } from '@/lib/safe-action';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export const logoutAdminAction = authActionClient.action(async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { redirectTo: '/admin/login' as const };
});
