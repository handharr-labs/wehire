import { type Job } from '@/shared/domain/entities/Job';

export function isJobOpen(job: Job, now: Date = new Date()): boolean {
  if (job.status !== 'active') return false;
  if (!job.expiredAt) return true;
  return new Date(job.expiredAt) > now;
}
