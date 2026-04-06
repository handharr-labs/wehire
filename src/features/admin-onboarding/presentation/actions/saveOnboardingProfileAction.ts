'use server';

import { authActionClient } from '@/lib/safe-action';
import { saveCompanyProfileUseCase } from '@/di/container.server';
import { DomainError } from '@/shared/domain/errors/DomainError';
import { onboardingProfileSchema } from '../schemas/onboardingProfileSchema';

export const saveOnboardingProfileAction = authActionClient
  .schema(onboardingProfileSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    if (session.role !== 'COMPANY_ADMIN') {
      throw DomainError.unauthorized();
    }

    const companyId = session.companyId;
    if (!companyId) {
      throw DomainError.unauthorized();
    }

    await saveCompanyProfileUseCase.execute(companyId, {
      name: parsedInput.name,
      logoUrl: parsedInput.logoUrl,
      primaryColor: parsedInput.primaryColor,
      secondaryColor: parsedInput.secondaryColor,
      contactEmail: parsedInput.contactEmail,
      whatsappNumber: parsedInput.whatsappNumber,
    });

    return { success: true };
  });
