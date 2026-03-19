import { describe, it, expect, vi } from 'vitest';
import { GetJobDetailUseCaseImpl } from '../GetJobDetailUseCase';
import { type JobRepository } from '../../repositories/JobRepository';
import { type Job } from '../../entities/Job';

const mockJob: Job = {
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

describe('GetJobDetailUseCase', () => {
  it('delegates to jobRepository.getById and returns the result', async () => {
    const mockRepo = {
      getById: vi.fn().mockResolvedValue(mockJob),
    } as unknown as JobRepository;

    const useCase = new GetJobDetailUseCaseImpl(mockRepo);
    const result = await useCase.execute('j1', 'c1');

    expect(mockRepo.getById).toHaveBeenCalledWith('j1', 'c1');
    expect(result).toEqual(mockJob);
  });
});
