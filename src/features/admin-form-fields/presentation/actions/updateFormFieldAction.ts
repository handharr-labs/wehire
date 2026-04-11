'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { updateFormFieldUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';

const schema = z.object({
  companyId: z.string().min(1),
  fieldId: z.string().min(1),
  label: z.string().min(1).optional(),
  type: z.enum(['text', 'textarea', 'email', 'tel', 'url', 'number', 'date', 'select', 'file']).optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
});

export const updateFormFieldAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    if (session.role === 'COMPANY_ADMIN' && parsedInput.companyId !== session.companyId) {
      throw DomainError.unauthorized();
    }
    const { companyId, fieldId, ...input } = parsedInput;
    await updateFormFieldUseCase.execute(companyId, fieldId, input);
  });
