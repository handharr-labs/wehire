'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { reorderFormFieldsUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';

const schema = z.object({
  companyId: z.string().min(1),
  order: z.array(z.object({ id: z.string(), sortOrder: z.number() })),
});

export const reorderFormFieldsAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    if (session.role === 'COMPANY_ADMIN' && parsedInput.companyId !== session.companyId) {
      throw DomainError.unauthorized();
    }
    await reorderFormFieldsUseCase.execute(parsedInput.companyId, parsedInput.order);
  });
