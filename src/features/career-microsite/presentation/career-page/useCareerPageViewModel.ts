'use client';

import { type Company } from '../../domain/entities/Company';
import { type Job } from '../../domain/entities/Job';

export interface CareerPageViewModel {
  company: Company;
  jobs: Job[];
}

export function useCareerPageViewModel(initialData: CareerPageViewModel): CareerPageViewModel {
  return initialData;
}
