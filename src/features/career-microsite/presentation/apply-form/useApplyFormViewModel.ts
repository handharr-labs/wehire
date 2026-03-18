'use client';

import { useState } from 'react';
import { type Company } from '../../domain/entities/Company';
import { type Job } from '../../domain/entities/Job';
import { type SubmitApplicationUseCase } from '../../domain/use-cases/SubmitApplicationUseCase';
import { DomainError } from '@/shared/domain/errors/DomainError';
import { applicationFormSchema } from './applicationFormSchema';

export interface ApplyFormViewModel {
  company: Company;
  job: Job;
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

    const result = applicationFormSchema.safeParse({
      fullName:          formData.get('fullName'),
      email:             formData.get('email'),
      phone:             formData.get('phone'),
      city:              formData.get('city'),
      experienceSummary: formData.get('experienceSummary'),
      expectedSalary:    formData.get('expectedSalary'),
      cvFile:            formData.get('cvFile'),
      linkedinUrl:       formData.get('linkedinUrl'),
      portfolioUrl:      formData.get('portfolioUrl'),
      coverLetter:       formData.get('coverLetter'),
    });

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
      await submitUseCase.execute({
        jobId: job.id,
        companyId: company.id,
        ...result.data,
      });
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

  return { company, job, isSubmitting, error, fieldErrors, handleSubmit, handleCvFileChange };
}
