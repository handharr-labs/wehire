'use server';

import { redirect } from 'next/navigation';
import { authActionClient } from '@/lib/safe-action';
import { getCompanySettingsUseCase, updateCompanySettingsUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';

export const launchCompanyAction = authActionClient.action(async ({ ctx: { session } }) => {
  if (session.role !== 'COMPANY_ADMIN') {
    throw DomainError.unauthorized();
  }

  const companyId = session.companyId;
  if (!companyId) {
    throw DomainError.unauthorized();
  }

  // Fetch existing company to preserve all fields while updating siteStatus only
  const existing = await getCompanySettingsUseCase.execute(companyId);

  await updateCompanySettingsUseCase().execute(companyId, {
    name: existing.name,
    logoUrl: existing.logoUrl,
    primaryColor: existing.primaryColor,
    secondaryColor: existing.secondaryColor,
    description: existing.description,
    contactEmail: existing.contactEmail,
    whatsappNumber: existing.whatsappNumber,
    siteStatus: 'active',
  });

  redirect('/admin/jobs');
});
