'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { deleteJobUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';

const schema = z.object({
  jobId: z.string().min(1),
  companyId: z.string().min(1),
});

export const deleteJobAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    if (session.role === 'COMPANY_ADMIN' && parsedInput.companyId !== session.companyId) {
      throw DomainError.unauthorized();
    }

    await deleteJobUseCase().execute(parsedInput.jobId, parsedInput.companyId);
  });
