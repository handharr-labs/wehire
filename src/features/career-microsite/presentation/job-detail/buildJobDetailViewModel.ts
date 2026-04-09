import { type Company } from '@/shared/domain/entities/Company';
import { type Job } from '@/shared/domain/entities/Job';
import { isJobOpen } from '../../domain/helpers/isJobOpen';

export interface JobDetailViewModelInput {
  company: Company;
  job: Job;
}

export function buildJobDetailViewModel({ company, job }: JobDetailViewModelInput) {
  const salaryLabel =
    job.minSalary > 0
      ? `Rp ${job.minSalary.toLocaleString('id-ID')} – Rp ${job.maxSalary.toLocaleString('id-ID')}`
      : 'Negotiable';

  return { company, job, salaryLabel, isOpen: isJobOpen(job, new Date()) };
}
