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
  it('returns false for "closed" status', () => {
    expect(isJobOpen({ ...baseJob, status: 'closed' })).toBe(false);
  });

  it('returns false for "draft" status', () => {
    expect(isJobOpen({ ...baseJob, status: 'draft' })).toBe(false);
  });

  it('returns true for active status with no expiry', () => {
    expect(isJobOpen({ ...baseJob, expiredAt: '' })).toBe(true);
  });

  it('returns true for active status with a future expiry date', () => {
    const future = new Date(Date.now() + 86_400_000).toISOString();
    expect(isJobOpen({ ...baseJob, expiredAt: future })).toBe(true);
  });

  it('returns false for active status with a past expiry date', () => {
    const past = new Date(Date.now() - 86_400_000).toISOString();
    expect(isJobOpen({ ...baseJob, expiredAt: past })).toBe(false);
  });
});
