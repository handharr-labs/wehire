'use client';

import { type Company } from '../../domain/entities/Company';
import { type Job } from '../../domain/entities/Job';

export interface JobDetailViewModel {
  company: Company;
  job: Job;
}

export function useJobDetailViewModel(initialData: JobDetailViewModel): JobDetailViewModel {
  return initialData;
}
