import { z } from 'zod';

export const onboardingProfileSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  logoUrl: z.string().url('Must be a valid URL'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  contactEmail: z.string().email('Must be a valid email'),
  whatsappNumber: z.string().min(1, 'WhatsApp number is required'),
});

export type OnboardingProfileInput = z.infer<typeof onboardingProfileSchema>;
