'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { deleteFormFieldUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';

const schema = z.object({
  companyId: z.string().min(1),
  fieldId: z.string().min(1),
});

export const deleteFormFieldAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    if (session.role === 'COMPANY_ADMIN' && parsedInput.companyId !== session.companyId) {
      throw DomainError.unauthorized();
    }
    await deleteFormFieldUseCase.execute(parsedInput.companyId, parsedInput.fieldId);
  });
