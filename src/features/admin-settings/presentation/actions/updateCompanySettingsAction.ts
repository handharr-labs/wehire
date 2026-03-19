'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { updateCompanySettingsUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';
import { companySettingsFormSchema } from '../settings/companySettingsFormSchema';

const schema = companySettingsFormSchema.extend({ companyId: z.string().min(1) });

export const updateCompanySettingsAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    if (session.role === 'COMPANY_ADMIN' && parsedInput.companyId !== session.companyId) {
      throw DomainError.unauthorized();
    }
    const { companyId, ...input } = parsedInput;
    await updateCompanySettingsUseCase().execute(companyId, input);
  });
