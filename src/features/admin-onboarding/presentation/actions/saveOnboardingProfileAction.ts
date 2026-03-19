'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { getCompanySettingsUseCase, updateCompanySettingsUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';
import { onboardingProfileSchema } from '../schemas/onboardingProfileSchema';

const schema = onboardingProfileSchema;

export const saveOnboardingProfileAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    if (session.role !== 'COMPANY_ADMIN') {
      throw DomainError.unauthorized();
    }

    const companyId = session.companyId;
    if (!companyId) {
      throw DomainError.unauthorized();
    }

    // Fetch existing company to preserve fields not in the onboarding form
    const existing = await getCompanySettingsUseCase.execute(companyId);

    await updateCompanySettingsUseCase().execute(companyId, {
      name: parsedInput.name,
      logoUrl: parsedInput.logoUrl,
      primaryColor: parsedInput.primaryColor,
      secondaryColor: parsedInput.secondaryColor,
      description: existing.description,
      contactEmail: parsedInput.contactEmail,
      whatsappNumber: parsedInput.whatsappNumber,
      siteStatus: existing.siteStatus,
    });

    return { success: true };
  });
