'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { createFormFieldUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';

const schema = z.object({
  companyId: z.string().min(1),
  label: z.string().min(1, 'Label is required.'),
  type: z.enum(['text', 'textarea', 'email', 'tel', 'url', 'number', 'date', 'select', 'file']),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  sortOrder: z.number().optional(),
});

export const createFormFieldAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    if (session.role === 'COMPANY_ADMIN' && parsedInput.companyId !== session.companyId) {
      throw DomainError.unauthorized();
    }
    const { companyId, ...input } = parsedInput;
    return createFormFieldUseCase.execute(companyId, input);
  });
