import { type Job } from '../entities/Job';

export function isJobOpen(job: Job): boolean {
  if (job.status !== 'active') return false;
  if (!job.expiredAt) return true;
  return new Date(job.expiredAt) > new Date();
}
