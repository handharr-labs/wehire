import { describe, it, expect, vi } from 'vitest';
import { GetJobsUseCaseImpl } from '../GetJobsUseCase';
import { type JobRepository } from '../../repositories/JobRepository';
import { type Job } from '../../entities/Job';

const mockJobs: Job[] = [
  {
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
  },
];

describe('GetJobsUseCase', () => {
  it('delegates to jobRepository.getByCompanyId and returns the result', async () => {
    const mockRepo = {
      getByCompanyId: vi.fn().mockResolvedValue(mockJobs),
    } as unknown as JobRepository;

    const useCase = new GetJobsUseCaseImpl(mockRepo);
    const result = await useCase.execute('c1');

    expect(mockRepo.getByCompanyId).toHaveBeenCalledWith('c1');
    expect(result).toEqual(mockJobs);
  });
});
