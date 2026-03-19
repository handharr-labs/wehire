import { z } from 'zod';

export const jobFormSchema = z
  .object({
    title: z.string().min(1, 'Job title is required'),
    department: z.string().min(1, 'Department is required'),
    location: z.string().min(1, 'Location is required'),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship'], {
      errorMap: () => ({ message: 'Select a valid employment type' }),
    }),
    minSalary: z.coerce
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, 'Min salary must be 0 or more'),
    maxSalary: z.coerce
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, 'Max salary must be 0 or more'),
    description: z.string().min(1, 'Description is required'),
    requirements: z.string().min(1, 'Requirements are required'),
    status: z.enum(['active', 'closed', 'draft'], {
      errorMap: () => ({ message: 'Select a valid status' }),
    }),
    expiredAt: z.string().min(1, 'Expiry date is required'),
    sortOrder: z.coerce.number().min(0).default(0),
  })
  .refine((data) => data.maxSalary >= data.minSalary, {
    message: 'Max salary must be greater than or equal to min salary',
    path: ['maxSalary'],
  });

export type JobFormValues = z.infer<typeof jobFormSchema>;
