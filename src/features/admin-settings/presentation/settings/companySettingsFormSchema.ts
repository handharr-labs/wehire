import { z } from 'zod';

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color (e.g. #RRGGBB)');

export const companySettingsFormSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  logoUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  primaryColor: hexColor,
  secondaryColor: hexColor,
  description: z.string().min(1, 'Description is required'),
  contactEmail: z.string().email('Must be a valid email'),
  whatsappNumber: z.string().min(1, 'WhatsApp number is required'),
  siteStatus: z.enum(['active', 'inactive']),
});

export type CompanySettingsFormValues = z.infer<typeof companySettingsFormSchema>;
