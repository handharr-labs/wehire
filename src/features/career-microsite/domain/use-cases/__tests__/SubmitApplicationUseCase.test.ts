import { describe, it, expect, vi } from 'vitest';
import { SubmitApplicationUseCaseImpl } from '../SubmitApplicationUseCase';
import { type ApplicationRepository } from '../../repositories/ApplicationRepository';
import { type GetJobDetailUseCase } from '../GetJobDetailUseCase';
import { type ApplicationPayload } from '../../entities/ApplicationPayload';
import { type Job } from '../../entities/Job';
import { DomainError } from '@/shared/domain/errors/DomainError';

const openJob: Job = {
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

const closedJob: Job = { ...openJob, status: 'closed' };

const expiredJob: Job = {
  ...openJob,
  expiredAt: new Date(Date.now() - 86_400_000).toISOString(),
};

const payload: ApplicationPayload = {
  jobId: 'j1',
  companyId: 'c1',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '081234567890',
  city: 'Jakarta',
  experienceSummary: '5 years',
  expectedSalary: 5_000_000,
  cvFile: new File(['cv'], 'cv.pdf', { type: 'application/pdf' }),
};

function makeUseCase(job: Job) {
  const mockGetJobDetail: GetJobDetailUseCase = {
    execute: vi.fn().mockResolvedValue(job),
  };
  const mockAppRepo = {
    submit: vi.fn().mockResolvedValue(undefined),
  } as unknown as ApplicationRepository;

  return {
    useCase: new SubmitApplicationUseCaseImpl(mockAppRepo, mockGetJobDetail),
    mockGetJobDetail,
    mockAppRepo,
  };
}

describe('SubmitApplicationUseCase', () => {
  it('calls getJobDetailUseCase.execute with the jobId from payload', async () => {
    const { useCase, mockGetJobDetail } = makeUseCase(openJob);
    await useCase.execute(payload);
    expect(mockGetJobDetail.execute).toHaveBeenCalledWith('j1');
  });

  it('calls applicationRepository.submit when the job is open', async () => {
    const { useCase, mockAppRepo } = makeUseCase(openJob);
    await useCase.execute(payload);
    expect(mockAppRepo.submit).toHaveBeenCalledWith(payload);
  });

  it('throws DomainError validationFailed when the job is closed', async () => {
    const { useCase } = makeUseCase(closedJob);
    await expect(useCase.execute(payload)).rejects.toMatchObject({
      code: 'validationFailed',
    });
  });

  it('throws DomainError validationFailed when the job is expired', async () => {
    const { useCase } = makeUseCase(expiredJob);
    await expect(useCase.execute(payload)).rejects.toBeInstanceOf(DomainError);
  });

  it('does NOT call applicationRepository.submit when the job is closed', async () => {
    const { useCase, mockAppRepo } = makeUseCase(closedJob);
    await expect(useCase.execute(payload)).rejects.toThrow();
    expect(mockAppRepo.submit).not.toHaveBeenCalled();
  });
});
