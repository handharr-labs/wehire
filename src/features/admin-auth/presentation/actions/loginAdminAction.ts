'use server';

import { cookies } from 'next/headers';
import { actionClient } from '@/lib/safe-action';
import { signSession, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/session';
import { loginFormSchema } from '../login/loginFormSchema';
import { loginAdminUseCase } from '@/di/container.server';

export const loginAdminAction = actionClient
  .schema(loginFormSchema)
  .action(async ({ parsedInput }) => {
    const payload = await loginAdminUseCase().execute(parsedInput);
    const token = await signSession(payload);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

    return { role: payload.role, companyId: payload.companyId };
  });
