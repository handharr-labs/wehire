import { unstable_cache } from 'next/cache';
import {
  getCompanyBySlugUseCase,
  getJobDetailUseCase,
  getJobDetailBySlugUseCase,
  getJobsUseCase,
} from '@/di/container.server';

export const getCachedCompanyBySlug = unstable_cache(
  (slug: string) => getCompanyBySlugUseCase.execute(slug),
  ['company-by-slug'],
  { revalidate: 60, tags: ['company'] },
);

export const getCachedJobsByCompanyId = unstable_cache(
  (companyId: string) => getJobsUseCase.execute(companyId),
  ['jobs-by-company'],
  { revalidate: 60, tags: ['job'] },
);

export const getCachedJobDetail = unstable_cache(
  (jobId: string, companyId: string) => getJobDetailUseCase.execute(jobId, companyId),
  ['job-detail'],
  { revalidate: 60, tags: ['job'] },
);

export const getCachedJobDetailBySlug = unstable_cache(
  (jobId: string, slug: string) => getJobDetailBySlugUseCase.execute(jobId, slug),
  ['job-detail-by-slug'],
  { revalidate: 60, tags: ['job'] },
);
