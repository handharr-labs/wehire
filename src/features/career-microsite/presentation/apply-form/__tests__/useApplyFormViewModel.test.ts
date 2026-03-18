import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApplyFormViewModel } from '../useApplyFormViewModel';
import { type SubmitApplicationUseCase } from '../../../domain/use-cases/SubmitApplicationUseCase';
import { type Company } from '../../../domain/entities/Company';
import { type Job } from '../../../domain/entities/Job';
import { DomainError } from '@/shared/domain/errors/DomainError';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeFile(size: number): File {
  return new File([new Uint8Array(size)], 'cv.pdf', { type: 'application/pdf' });
}

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

function buildFormData(overrides: Record<string, string | File> = {}): FormData {
  const fd = new FormData();
  const defaults: Record<string, string | File> = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '081234567890',
    city: 'Jakarta',
    experienceSummary: '5 years of experience',
    expectedSalary: '5000000',
    cvFile: makeFile(1024),
    linkedinUrl: '',
    portfolioUrl: '',
    coverLetter: '',
  };
  const merged = { ...defaults, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    if (value instanceof File) {
      fd.append(key, value, value.name);
    } else {
      fd.append(key, value);
    }
  }
  return fd;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setup(submitExecute: SubmitApplicationUseCase['execute'] = vi.fn().mockResolvedValue(undefined)) {
  const submitUseCase: SubmitApplicationUseCase = { execute: submitExecute };
  const onSuccess = vi.fn();
  const { result } = renderHook(() =>
    useApplyFormViewModel(company, job, submitUseCase, onSuccess),
  );
  return { result, submitUseCase, onSuccess };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useApplyFormViewModel', () => {
  describe('initial state', () => {
    it('exposes company and job from arguments', () => {
      const { result } = setup();
      expect(result.current.company).toEqual(company);
      expect(result.current.job).toEqual(job);
    });

    it('starts with isSubmitting=false, error=null, fieldErrors=null', () => {
      const { result } = setup();
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.fieldErrors).toBeNull();
    });
  });

  describe('Zod validation failure', () => {
    it('populates fieldErrors and resets isSubmitting when required fields are missing', async () => {
      const { result, submitUseCase } = setup();

      await act(async () => {
        // Empty FormData → all required fields missing
        await result.current.handleSubmit(new FormData());
      });

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.fieldErrors).not.toBeNull();
      expect(Object.keys(result.current.fieldErrors!).length).toBeGreaterThan(0);
      expect(submitUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('successful submission', () => {
    it('calls submitUseCase.execute and onSuccess, then resets isSubmitting', async () => {
      const { result, submitUseCase, onSuccess } = setup();

      await act(async () => {
        await result.current.handleSubmit(buildFormData());
      });

      expect(submitUseCase.execute).toHaveBeenCalledOnce();
      expect(onSuccess).toHaveBeenCalledOnce();
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.fieldErrors).toBeNull();
    });
  });

  describe('DomainError validationFailed', () => {
    it('sets error to "This position is no longer accepting applications."', async () => {
      const { result } = setup(
        vi.fn().mockRejectedValue(DomainError.validationFailed('job', 'inactive or expired')),
      );

      await act(async () => {
        await result.current.handleSubmit(buildFormData());
      });

      expect(result.current.error).toBe('This position is no longer accepting applications.');
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('generic error', () => {
    it('sets error to "Failed to submit application. Please try again."', async () => {
      const { result } = setup(vi.fn().mockRejectedValue(new Error('Network error')));

      await act(async () => {
        await result.current.handleSubmit(buildFormData());
      });

      expect(result.current.error).toBe('Failed to submit application. Please try again.');
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('handleCvFileChange', () => {
    it('clears cvFile key from fieldErrors while preserving other errors', async () => {
      const { result, submitUseCase } = setup();

      // Trigger validation errors by submitting a form missing only the CV
      await act(async () => {
        const fd = buildFormData({ cvFile: makeFile(0) }); // size=0 → "Please attach your CV."
        await result.current.handleSubmit(fd);
      });

      expect(submitUseCase.execute).not.toHaveBeenCalled();
      expect(result.current.fieldErrors?.cvFile).toBeDefined();

      // Now simulate user choosing a new file
      act(() => {
        result.current.handleCvFileChange();
      });

      expect(result.current.fieldErrors?.cvFile).toBeUndefined();
    });

    it('does not affect non-cvFile errors when clearing cvFile', async () => {
      const { result } = setup();

      // Submit with empty form to get multiple errors
      await act(async () => {
        await result.current.handleSubmit(new FormData());
      });

      const errorsBefore = { ...result.current.fieldErrors };
      const nonCvKeys = Object.keys(errorsBefore).filter((k) => k !== 'cvFile');
      expect(nonCvKeys.length).toBeGreaterThan(0);

      act(() => {
        result.current.handleCvFileChange();
      });

      for (const key of nonCvKeys) {
        expect(result.current.fieldErrors?.[key]).toBe(errorsBefore[key]);
      }
    });
  });
});
