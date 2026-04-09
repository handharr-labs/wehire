import { describe, it, expect } from 'vitest';
import { isJobOpen } from '../isJobOpen';
import { type Job } from '../../entities/Job';

const baseJob: Job = {
  id: 'j1',
  companyId: 'c1',
  title: 'Engineer',
  department: 'Eng',
  location: 'Jakarta',
  employmentType: 'full-time',
  minSalary: 0,
  maxSalary: 0,
  description: '',
  requirements: '',
  status: 'active',
  expiredAt: '',
  sortOrder: 1,
};

describe('isJobOpen', () => {
  const now = new Date('2026-04-09T00:00:00Z');

  it('returns false for "closed" status', () => {
    expect(isJobOpen({ ...baseJob, status: 'closed' }, now)).toBe(false);
  });

  it('returns false for "draft" status', () => {
    expect(isJobOpen({ ...baseJob, status: 'draft' }, now)).toBe(false);
  });

  it('returns true for active status with no expiry', () => {
    expect(isJobOpen({ ...baseJob, expiredAt: '' }, now)).toBe(true);
  });

  it('returns true for active status with a future expiry date', () => {
    const future = new Date('2026-04-10T00:00:00Z').toISOString();
    expect(isJobOpen({ ...baseJob, expiredAt: future }, now)).toBe(true);
  });

  it('returns false for active status with a past expiry date', () => {
    const past = new Date('2026-04-08T00:00:00Z').toISOString();
    expect(isJobOpen({ ...baseJob, expiredAt: past }, now)).toBe(false);
  });
});
