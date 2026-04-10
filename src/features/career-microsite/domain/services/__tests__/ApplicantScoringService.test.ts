import { describe, it, expect } from 'vitest';
import { ApplicantScoringServiceImpl, type ScoringInput } from '../ApplicantScoringService';
import { type ApplicationPayload } from '@/shared/domain/entities/ApplicationPayload';
import { type Job } from '@/shared/domain/entities/Job';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const baseJob: Job = {
  id: 'j1',
  companyId: 'c1',
  title: 'Engineer',
  department: 'Engineering',
  location: 'Jakarta',
  employmentType: 'full-time',
  minSalary: 5_000_000,
  maxSalary: 10_000_000,
  description: '',
  requirements: '',
  status: 'active',
  expiredAt: '',
  sortOrder: 1,
  targetCity: 'Jakarta, Bandung',
};

const basePayload: ApplicationPayload = {
  jobId: 'j1',
  companyId: 'c1',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '081234567890',
  city: 'Jakarta',
  experienceSummary: '3 years',
  expectedSalary: 7_000_000,
  cvBase64: 'dGVzdA==',
  cvFileName: 'cv.pdf',
  cvFileMime: 'application/pdf',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  portfolioUrl: 'https://portfolio.example.com',
};

function makeInput(
  payloadOverrides: Partial<ApplicationPayload> = {},
  jobOverrides: Partial<Job> = {},
  scoringEnabled = true,
): ScoringInput {
  return {
    payload: { ...basePayload, ...payloadOverrides },
    job: { ...baseJob, ...jobOverrides },
    scoringEnabled,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ApplicantScoringServiceImpl', () => {
  const service = new ApplicantScoringServiceImpl();

  describe('scoring disabled', () => {
    it('returns null when scoringEnabled is false', () => {
      expect(service.score(makeInput({}, {}, false))).toBeNull();
    });
  });

  describe('full score', () => {
    it('returns 100 when all rules match', () => {
      expect(service.score(makeInput())).toBe(100);
    });
  });

  describe('salary fit', () => {
    it('awards 0 salary pts when expected_salary is below min_salary', () => {
      const result = service.score(
        makeInput({ expectedSalary: 3_000_000, city: 'Other', linkedinUrl: undefined, portfolioUrl: undefined }),
      );
      expect(result).toBe(0);
    });

    it('awards 0 salary pts when expected_salary is above max_salary', () => {
      const result = service.score(
        makeInput({ expectedSalary: 12_000_000, city: 'Other', linkedinUrl: undefined, portfolioUrl: undefined }),
      );
      expect(result).toBe(0);
    });

    it('awards full salary pts at the lower boundary (min_salary)', () => {
      // salary=40 of 100 applicable → 40
      const result = service.score(
        makeInput({ expectedSalary: 5_000_000, city: 'Other', linkedinUrl: undefined, portfolioUrl: undefined }),
      );
      expect(result).toBe(40);
    });

    it('awards full salary pts at the upper boundary (max_salary)', () => {
      const result = service.score(
        makeInput({ expectedSalary: 10_000_000, city: 'Other', linkedinUrl: undefined, portfolioUrl: undefined }),
      );
      expect(result).toBe(40);
    });
  });

  describe('domicile fit', () => {
    it('awards domicile pts when city matches the single target_city', () => {
      const result = service.score(
        makeInput(
          { expectedSalary: 3_000_000, city: 'Bandung', linkedinUrl: undefined, portfolioUrl: undefined },
          { targetCity: 'Bandung' },
        ),
      );
      expect(result).toBe(30);
    });

    it('awards domicile pts when city matches one of the comma-separated target cities', () => {
      const result = service.score(
        makeInput({ expectedSalary: 3_000_000, city: 'Bandung', linkedinUrl: undefined, portfolioUrl: undefined }),
      );
      expect(result).toBe(30);
    });

    it('is case-insensitive for city matching', () => {
      const result = service.score(
        makeInput({ expectedSalary: 3_000_000, city: 'JAKARTA', linkedinUrl: undefined, portfolioUrl: undefined }),
      );
      expect(result).toBe(30);
    });

    it('awards 0 domicile pts when city does not match any target_city entry', () => {
      const result = service.score(
        makeInput({ expectedSalary: 3_000_000, city: 'Surabaya', linkedinUrl: undefined, portfolioUrl: undefined }),
      );
      expect(result).toBe(0);
    });
  });

  describe('LinkedIn presence', () => {
    it('awards 15 pts when linkedinUrl is provided', () => {
      const result = service.score(
        makeInput({ expectedSalary: 3_000_000, city: 'Surabaya', portfolioUrl: undefined }),
      );
      expect(result).toBe(15);
    });

    it('awards 0 pts when linkedinUrl is absent', () => {
      const result = service.score(
        makeInput({ expectedSalary: 3_000_000, city: 'Surabaya', linkedinUrl: undefined, portfolioUrl: undefined }),
      );
      expect(result).toBe(0);
    });
  });

  describe('portfolio presence', () => {
    it('awards 15 pts when portfolioUrl is provided', () => {
      const result = service.score(
        makeInput({ expectedSalary: 3_000_000, city: 'Surabaya', linkedinUrl: undefined }),
      );
      expect(result).toBe(15);
    });

    it('awards 0 pts when portfolioUrl is absent', () => {
      const result = service.score(
        makeInput({ expectedSalary: 3_000_000, city: 'Surabaya', linkedinUrl: undefined, portfolioUrl: undefined }),
      );
      expect(result).toBe(0);
    });
  });

  describe('normalization when config is missing', () => {
    it('normalizes to 100 when salary config is missing (minSalary=0, maxSalary=0)', () => {
      // salary skipped; applicable = domicile(30)+linkedin(15)+portfolio(15)=60; earned=60 → 100
      const result = service.score(makeInput({}, { minSalary: 0, maxSalary: 0 }));
      expect(result).toBe(100);
    });

    it('normalizes to 100 when target_city is missing', () => {
      // domicile skipped; applicable = salary(40)+linkedin(15)+portfolio(15)=70; earned=70 → 100
      const result = service.score(makeInput({ expectedSalary: 7_000_000 }, { targetCity: undefined }));
      expect(result).toBe(100);
    });

    it('normalizes to 100 when both salary config and target_city are missing', () => {
      // only linkedin(15)+portfolio(15)=30 applicable; earned=30 → 100
      const result = service.score(
        makeInput({ expectedSalary: 7_000_000 }, { minSalary: 0, maxSalary: 0, targetCity: undefined }),
      );
      expect(result).toBe(100);
    });

    it('returns 0 when scoring is enabled but all applicable rules score 0', () => {
      const result = service.score(
        makeInput({ expectedSalary: 3_000_000, city: 'Surabaya', linkedinUrl: undefined, portfolioUrl: undefined }),
      );
      expect(result).toBe(0);
    });
  });
});
