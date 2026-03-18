import { z } from 'zod';

const CV_MAX_BYTES = 5 * 1024 * 1024;

const optionalUrl = z
  .union([z.literal(''), z.string().url('Please enter a valid URL.')])
  .transform((v) => v || undefined);

export const applicationFormSchema = z.object({
  fullName:          z.string().min(1, 'Full name is required.'),
  email:             z.string().email('Please enter a valid email address.'),
  phone:             z.string().min(1, 'Phone number is required.'),
  city:              z.string().min(1, 'City is required.'),
  experienceSummary: z.string().min(1, 'Experience summary is required.'),
  expectedSalary:    z.coerce.number().min(0, 'Expected salary must be 0 or more.'),
  cvFile:            z
                       .instanceof(File)
                       .refine((f) => f.size > 0, 'Please attach your CV.')
                       .refine((f) => f.size <= CV_MAX_BYTES, 'CV file must be 5 MB or smaller.'),
  linkedinUrl:       optionalUrl.optional(),
  portfolioUrl:      optionalUrl.optional(),
  coverLetter:       z.string().optional().transform((v) => v || undefined),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
