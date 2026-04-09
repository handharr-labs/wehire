'use client';

import { useRouter } from 'next/navigation';
import { submitApplicationUseCase } from '@/di/container.client';
import { type Company } from '@/shared/domain/entities/Company';
import { type Job } from '@/shared/domain/entities/Job';
import { ApplyFormView } from '@/features/career-microsite/presentation/apply-form/ApplyFormView';
import { useApplyFormViewModel } from '@/features/career-microsite/presentation/apply-form/useApplyFormViewModel';

interface Props {
  company: Company;
  job: Job;
}

export function ApplyFormClientWrapper({ company, job }: Props) {
  const router = useRouter();
  const vm = useApplyFormViewModel(
    company,
    job,
    submitApplicationUseCase,
    () => router.push(`/${company.slug}/jobs/${job.id}/apply/success`),
  );

  return <ApplyFormView company={company} job={job} vm={vm} />;
}
