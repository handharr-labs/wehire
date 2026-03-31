'use server';

import { cookies } from 'next/headers';
import { actionClient } from '@/lib/safe-action';
import { signSession, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS, type AdminSessionPayload } from '@/lib/session';
import { loginFormSchema } from '../login/loginFormSchema';
import { loginAdminUseCase } from '@/di/container.server';

export const loginAdminAction = actionClient
  .schema(loginFormSchema)
  .action(async ({ parsedInput }) => {
    const session = await loginAdminUseCase.execute(parsedInput);
    const payload: AdminSessionPayload = {
      sub: session.adminId,
      email: session.email,
      role: session.role,
      companyId: session.companyId,
    };
    const token = await signSession(payload);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

    return { role: session.role, companyId: session.companyId };
  });
