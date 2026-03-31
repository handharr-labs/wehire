import { type Company } from '../../domain/entities/Company';
import { type Job } from '../../domain/entities/Job';

export interface CareerPageViewModelInput {
  company: Company;
  jobs: Job[];
}

export interface CareerPageViewModel {
  company: Company;
  jobs: Job[];
  isHiring: boolean;
}

export function buildCareerPageViewModel(initialData: CareerPageViewModelInput): CareerPageViewModel {
  return {
    ...initialData,
    isHiring: initialData.company.siteStatus === 'active',
  };
}
