'use client';

import { useState } from 'react';
import { type Company } from '../../domain/entities/Company';
import { type Job } from '../../domain/entities/Job';
import { type SubmitApplicationUseCase } from '../../domain/use-cases/SubmitApplicationUseCase';

export interface ApplyFormViewModel {
  company: Company;
  job: Job;
  isSubmitting: boolean;
  error: string | null;
  handleSubmit(formData: FormData): Promise<void>;
}

export function useApplyFormViewModel(
  company: Company,
  job: Job,
  submitUseCase: SubmitApplicationUseCase,
  onSuccess: () => void,
): ApplyFormViewModel {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    const cvFile = formData.get('cvFile');
    if (!(cvFile instanceof File) || cvFile.size === 0) {
      setError('Please attach your CV.');
      setIsSubmitting(false);
      return;
    }

    try {
      await submitUseCase.execute({
        jobId: job.id,
        companyId: company.id,
        fullName: String(formData.get('fullName') ?? ''),
        email: String(formData.get('email') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        city: String(formData.get('city') ?? ''),
        experienceSummary: String(formData.get('experienceSummary') ?? ''),
        expectedSalary: Number(formData.get('expectedSalary') ?? 0),
        cvFile,
        linkedinUrl: String(formData.get('linkedinUrl') ?? '') || undefined,
        portfolioUrl: String(formData.get('portfolioUrl') ?? '') || undefined,
        coverLetter: String(formData.get('coverLetter') ?? '') || undefined,
      });
      onSuccess();
    } catch {
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return { company, job, isSubmitting, error, handleSubmit };
}
