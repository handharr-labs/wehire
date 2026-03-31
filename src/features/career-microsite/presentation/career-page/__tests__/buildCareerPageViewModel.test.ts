import { describe, it, expect } from 'vitest';
import { buildCareerPageViewModel, type CareerPageViewModelInput } from '../buildCareerPageViewModel';
import { type Company } from '../../../domain/entities/Company';
import { type Job } from '../../../domain/entities/Job';

const baseCompany: Company = {
  id: 'c1',
  name: 'Acme',
  slug: 'acme',
  logoUrl: '',
  primaryColor: '',
  secondaryColor: '',
  description: '',
  contactEmail: '',
  whatsappNumber: '',
  siteStatus: 'active',
  maxActiveJobs: 5,
};

const job: Job = {
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

describe('buildCareerPageViewModel', () => {
  it('isHiring is true when siteStatus is active', () => {
    const input: CareerPageViewModelInput = { company: { ...baseCompany, siteStatus: 'active' }, jobs: [job] };
    const result = buildCareerPageViewModel(input);
    expect(result.isHiring).toBe(true);
  });

  it('isHiring is false when siteStatus is inactive', () => {
    const input: CareerPageViewModelInput = { company: { ...baseCompany, siteStatus: 'inactive' }, jobs: [job] };
    const result = buildCareerPageViewModel(input);
    expect(result.isHiring).toBe(false);
  });

  it('passes company and jobs through unchanged', () => {
    const input: CareerPageViewModelInput = { company: baseCompany, jobs: [job] };
    const result = buildCareerPageViewModel(input);
    expect(result.company).toBe(input.company);
    expect(result.jobs).toBe(input.jobs);
  });
});
