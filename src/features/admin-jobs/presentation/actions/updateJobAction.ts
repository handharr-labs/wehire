'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { updateJobUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';
import { jobFormSchema } from '../jobFormSchema';

const schema = jobFormSchema.extend({
  jobId: z.string().min(1),
  companyId: z.string().min(1),
});

export const updateJobAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    if (session.role === 'COMPANY_ADMIN' && parsedInput.companyId !== session.companyId) {
      throw DomainError.unauthorized();
    }

    const { jobId, companyId, ...input } = parsedInput;

    await updateJobUseCase().execute(jobId, companyId, {
      title: input.title,
      department: input.department,
      location: input.location,
      employmentType: input.employmentType,
      minSalary: input.minSalary,
      maxSalary: input.maxSalary,
      description: input.description,
      requirements: input.requirements,
      status: input.status,
      expiredAt: input.expiredAt,
      sortOrder: input.sortOrder,
    });
  });
