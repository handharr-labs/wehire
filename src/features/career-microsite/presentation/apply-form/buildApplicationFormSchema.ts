import { z } from 'zod';
import { type FormField } from '@/shared/domain/entities/FormField';

const CV_MAX_BYTES = 5 * 1024 * 1024;

const optionalUrl = z
  .union([z.literal(''), z.string().url('Please enter a valid URL.')])
  .transform((v) => v || undefined);

/**
 * Maps system field_names to the camelCase FormData keys used by the
 * apply form HTML inputs (kept for backward compatibility with the
 * Apps Script submission handler).
 */
export const SYSTEM_FIELD_FORM_KEY: Record<string, string> = {
  full_name:          'fullName',
  email:              'email',
  phone:              'phone',
  city:               'city',
  experience_summary: 'experienceSummary',
  expected_salary:    'expectedSalary',
  cv_url:             'cvFile',
  linkedin_url:       'linkedinUrl',
  portfolio_url:      'portfolioUrl',
  cover_letter:       'coverLetter',
};

const SYSTEM_FIELD_SCHEMAS: Record<string, z.ZodTypeAny> = {
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
};

/**
 * Builds a Zod schema from the enabled form fields for a company.
 * System fields use their hardcoded validators.
 * Custom fields are validated based on their type + required flag.
 *
 * Returns the schema and a map of which keys are custom field names
 * (used by the ViewModel to separate customFields from system fields).
 */
export function buildApplicationFormSchema(formFields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  const customFieldNames = new Set<string>();

  for (const field of formFields) {
    if (!field.enabled) continue;

    if (field.isSystem) {
      const formKey = SYSTEM_FIELD_FORM_KEY[field.fieldName];
      if (!formKey) continue;

      // Optional system fields can be made required by admin
      if (formKey === 'linkedinUrl' && field.required) {
        shape[formKey] = z.string().url('Please enter a valid URL.').min(1, 'LinkedIn URL is required.');
      } else if (formKey === 'portfolioUrl' && field.required) {
        shape[formKey] = z.string().url('Please enter a valid URL.').min(1, 'Portfolio URL is required.');
      } else if (formKey === 'coverLetter' && field.required) {
        shape[formKey] = z.string().min(1, 'Cover letter is required.');
      } else {
        shape[formKey] = SYSTEM_FIELD_SCHEMAS[formKey];
      }
    } else {
      customFieldNames.add(field.fieldName);
      let schema: z.ZodTypeAny;
      switch (field.type) {
        case 'number':
          schema = field.required
            ? z.coerce.number().min(0, `${field.label} is required.`)
            : z.coerce.number().optional();
          break;
        case 'email':
          schema = field.required
            ? z.string().email('Please enter a valid email address.')
            : z.union([z.literal(''), z.string().email()]).optional();
          break;
        case 'url':
          schema = field.required
            ? z.string().url('Please enter a valid URL.').min(1, `${field.label} is required.`)
            : optionalUrl.optional();
          break;
        default:
          schema = field.required
            ? z.string().min(1, `${field.label} is required.`)
            : z.string().optional();
      }
      shape[field.fieldName] = schema;
    }
  }

  return { schema: z.object(shape), customFieldNames };
}
