'use client';

import { useState } from 'react';
import { type Company } from '@/shared/domain/entities/Company';
import { type Job } from '@/shared/domain/entities/Job';
import { type FormField } from '@/shared/domain/entities/FormField';
import { type SubmitApplicationUseCase } from '../../domain/use-cases/SubmitApplicationUseCase';
import { DomainError } from '@/shared/domain/errors/DomainError';
import { buildApplicationFormSchema, SYSTEM_FIELD_FORM_KEY } from './buildApplicationFormSchema';

export interface ApplyFormViewModel {
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null;
  handleSubmit(formData: FormData): Promise<void>;
  handleCvFileChange(): void;
}

export function useApplyFormViewModel(
  company: Company,
  job: Job,
  submitUseCase: SubmitApplicationUseCase,
  onSuccess: () => void,
  formFields: FormField[],
): ApplyFormViewModel {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);

  function handleCvFileChange() {
    setFieldErrors((prev) => {
      if (!prev) return null;
      const next = { ...prev };
      delete next['cvFile'];
      return Object.keys(next).length > 0 ? next : null;
    });
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setFieldErrors(null);

    const { schema, customFieldNames } = buildApplicationFormSchema(formFields);

    // Build parse input: system fields with camelCase keys, custom with fieldName
    const parseInput: Record<string, unknown> = {};
    for (const field of formFields) {
      if (!field.enabled) continue;
      if (field.isSystem) {
        const formKey = SYSTEM_FIELD_FORM_KEY[field.fieldName];
        if (formKey) parseInput[formKey] = formData.get(formKey);
      } else {
        parseInput[field.fieldName] = formData.get(field.fieldName);
      }
    }

    const result = schema.safeParse(parseInput);

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setFieldErrors(
        Object.fromEntries(
          Object.entries(flat).map(([k, v]) => [k, v?.[0] ?? '']),
        ),
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const data = result.data as Record<string, unknown>;

      // Extract CV file and encode to base64
      const file = data['cvFile'] as File;
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const cvBase64 = btoa(binary);

      // Separate custom fields from system fields
      const customFields: Record<string, string | number> = {};
      for (const fieldName of customFieldNames) {
        const value = data[fieldName];
        if (value !== undefined && value !== '') {
          customFields[fieldName] = value as string | number;
        }
      }

      await submitUseCase.execute(
        {
          jobId:             job.id,
          companyId:         company.id,
          fullName:          data['fullName'] as string,
          email:             data['email'] as string,
          phone:             data['phone'] as string,
          city:              data['city'] as string,
          experienceSummary: data['experienceSummary'] as string,
          expectedSalary:    data['expectedSalary'] as number,
          cvBase64,
          cvFileName:        file.name,
          cvFileMime:        file.type,
          linkedinUrl:       data['linkedinUrl'] as string | undefined,
          portfolioUrl:      data['portfolioUrl'] as string | undefined,
          coverLetter:       data['coverLetter'] as string | undefined,
          ...(Object.keys(customFields).length > 0 ? { customFields } : {}),
        },
        company,
      );
      onSuccess();
    } catch (err) {
      if (err instanceof DomainError && err.code === 'validationFailed') {
        setError('This position is no longer accepting applications.');
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, error, fieldErrors, handleSubmit, handleCvFileChange };
}
