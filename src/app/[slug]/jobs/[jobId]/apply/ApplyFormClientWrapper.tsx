'use client';

import { useMemo } from 'react';
import { createClientContainer } from '@/di/container.client';
import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { type Job } from '@/features/career-microsite/domain/entities/Job';
import { ApplyFormView } from '@/features/career-microsite/presentation/apply-form/ApplyFormView';

interface Props {
  company: Company;
  job: Job;
}

export function ApplyFormClientWrapper({ company, job }: Props) {
  const { submitApplicationUseCase } = useMemo(() => createClientContainer(), []);

  return (
    <ApplyFormView
      company={company}
      job={job}
      submitUseCase={submitApplicationUseCase}
    />
  );
}
