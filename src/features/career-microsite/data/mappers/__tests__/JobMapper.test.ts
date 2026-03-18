import { describe, it, expect } from 'vitest';
import { JobMapper } from '../JobMapper';
import { type JobDTO } from '../../dtos/JobDTO';

const baseDTO: JobDTO = {
  id: 'j1',
  company_id: 'c1',
  title: 'Software Engineer',
  department: 'Engineering',
  location: 'Jakarta',
  employment_type: 'full-time',
  min_salary: 5_000_000,
  max_salary: 10_000_000,
  description: 'Build great things',
  requirements: 'Know your code',
  status: 'active',
  expired_at: '2027-01-01',
  sort_order: 1,
};

describe('JobMapper.toDomain', () => {
  it('maps all fields from snake_case DTO to camelCase entity', () => {
    const job = JobMapper.toDomain(baseDTO);
    expect(job).toEqual({
      id: 'j1',
      companyId: 'c1',
      title: 'Software Engineer',
      department: 'Engineering',
      location: 'Jakarta',
      employmentType: 'full-time',
      minSalary: 5_000_000,
      maxSalary: 10_000_000,
      description: 'Build great things',
      requirements: 'Know your code',
      status: 'active',
      expiredAt: '2027-01-01',
      sortOrder: 1,
    });
  });

  it('coerces "open" status to "active"', () => {
    const job = JobMapper.toDomain({ ...baseDTO, status: 'open' });
    expect(job.status).toBe('active');
  });

  it('falls back employmentType to "full-time" when employment_type is absent', () => {
    const dto = { ...baseDTO, employment_type: undefined as unknown as string };
    const job = JobMapper.toDomain(dto);
    expect(job.employmentType).toBe('full-time');
  });
});
