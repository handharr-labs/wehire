'use server';

import { authActionClient } from '@/lib/safe-action';
import { launchCompanyUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';

export const launchCompanyAction = authActionClient.action(async ({ ctx: { session } }) => {
  if (session.role !== 'COMPANY_ADMIN') {
    throw DomainError.unauthorized();
  }

  const companyId = session.companyId;
  if (!companyId) {
    throw DomainError.unauthorized();
  }

  await launchCompanyUseCase.execute(companyId);

  return { redirectTo: '/admin/jobs' };
});
