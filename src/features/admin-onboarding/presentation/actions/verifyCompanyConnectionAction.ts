'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { verifyCompanyConnectionUseCase } from '@/di/container.server';

export const verifyCompanyConnectionAction = authActionClient
  .schema(z.object({ slug: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    await verifyCompanyConnectionUseCase.execute(parsedInput.slug);
    return { connected: true };
  });
