'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { actionClient } from '@/lib/safe-action';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export const logoutAdminAction = actionClient.action(async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
});
