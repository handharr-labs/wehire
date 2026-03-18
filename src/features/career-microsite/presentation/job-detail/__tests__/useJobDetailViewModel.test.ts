import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useJobDetailViewModel, type JobDetailViewModel } from '../useJobDetailViewModel';
import { type Company } from '../../../domain/entities/Company';
import { type Job } from '../../../domain/entities/Job';

const company: Company = {
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

const initialData: JobDetailViewModel = { company, job };

describe('useJobDetailViewModel', () => {
  it('returns the initialData object unchanged', () => {
    const { result } = renderHook(() => useJobDetailViewModel(initialData));
    expect(result.current).toEqual(initialData);
  });
});
