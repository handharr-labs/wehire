'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}
