'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { verifyCompanyConnectionUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';

export const verifyCompanyConnectionAction = authActionClient
  .schema(z.object({ slug: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    const connected = await verifyCompanyConnectionUseCase.execute(parsedInput.slug);
    if (!connected) throw DomainError.notFound('Company', parsedInput.slug);
    return { connected: true };
  });
