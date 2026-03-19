'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { createJobUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';
import { jobFormSchema } from '../jobFormSchema';

const schema = jobFormSchema.extend({ companyId: z.string().min(1) });

export const createJobAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    const companyId =
      session.role === 'COMPANY_ADMIN' ? (session.companyId ?? parsedInput.companyId) : parsedInput.companyId;

    if (session.role === 'COMPANY_ADMIN' && parsedInput.companyId !== session.companyId) {
      throw DomainError.unauthorized();
    }

    const { companyId: _unused, ...input } = parsedInput;

    return createJobUseCase().execute({
      companyId,
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
