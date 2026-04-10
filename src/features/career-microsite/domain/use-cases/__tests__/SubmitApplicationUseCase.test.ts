import { describe, it, expect, vi } from 'vitest';
import { SubmitApplicationUseCaseImpl } from '../SubmitApplicationUseCase';
import { type ApplicationRepository } from '../../repositories/ApplicationRepository';
import { type GetJobDetailUseCase } from '../GetJobDetailUseCase';
import { type ApplicantScoringService } from '../../services/ApplicantScoringService';
import { type ApplicationPayload } from '@/shared/domain/entities/ApplicationPayload';
import { type Job } from '@/shared/domain/entities/Job';
import { type Company } from '@/shared/domain/entities/Company';
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
  scoringEnabled: false,
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
  cvBase64: 'dGVzdA==',
  cvFileName: 'cv.pdf',
  cvFileMime: 'application/pdf',
};

function makeUseCase(job: Job) {
  const mockGetJobDetail: GetJobDetailUseCase = {
    execute: vi.fn().mockResolvedValue(job),
  };
  const mockAppRepo = {
    submit: vi.fn().mockResolvedValue(undefined),
  } as unknown as ApplicationRepository;
  const mockScoringService: ApplicantScoringService = {
    score: vi.fn().mockReturnValue(null),
  };

  return {
    useCase: new SubmitApplicationUseCaseImpl(mockAppRepo, mockGetJobDetail, mockScoringService),
    mockGetJobDetail,
    mockAppRepo,
    mockScoringService,
  };
}

describe('SubmitApplicationUseCase', () => {
  it('calls getJobDetailUseCase.execute with the jobId and companyId from payload', async () => {
    const { useCase, mockGetJobDetail } = makeUseCase(openJob);
    await useCase.execute(payload, company);
    expect(mockGetJobDetail.execute).toHaveBeenCalledWith('j1', 'c1');
  });

  it('calls applicationRepository.submit when the job is open', async () => {
    const { useCase, mockAppRepo } = makeUseCase(openJob);
    await useCase.execute(payload, company);
    expect(mockAppRepo.submit).toHaveBeenCalledWith(
      expect.objectContaining({ jobId: 'j1', companyId: 'c1' }),
    );
  });

  it('calls scoringService.score with payload, job, and company.scoringEnabled', async () => {
    const { useCase, mockScoringService } = makeUseCase(openJob);
    await useCase.execute(payload, company);
    expect(mockScoringService.score).toHaveBeenCalledWith(
      expect.objectContaining({
        payload,
        job: openJob,
        scoringEnabled: company.scoringEnabled,
      }),
    );
  });

  it('attaches screeningScore from scoringService to the submitted payload', async () => {
    const { useCase, mockAppRepo, mockScoringService } = makeUseCase(openJob);
    (mockScoringService.score as ReturnType<typeof vi.fn>).mockReturnValue(75);
    await useCase.execute(payload, company);
    expect(mockAppRepo.submit).toHaveBeenCalledWith(
      expect.objectContaining({ screeningScore: 75 }),
    );
  });

  it('throws DomainError validationFailed when the job is closed', async () => {
    const { useCase } = makeUseCase(closedJob);
    await expect(useCase.execute(payload, company)).rejects.toMatchObject({
      code: 'validationFailed',
    });
  });

  it('throws DomainError validationFailed when the job is expired', async () => {
    const { useCase } = makeUseCase(expiredJob);
    await expect(useCase.execute(payload, company)).rejects.toBeInstanceOf(DomainError);
  });

  it('does NOT call applicationRepository.submit when the job is closed', async () => {
    const { useCase, mockAppRepo } = makeUseCase(closedJob);
    await expect(useCase.execute(payload, company)).rejects.toThrow();
    expect(mockAppRepo.submit).not.toHaveBeenCalled();
  });
});
