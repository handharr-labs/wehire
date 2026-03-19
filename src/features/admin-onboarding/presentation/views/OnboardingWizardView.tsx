'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import {
  onboardingProfileSchema,
  type OnboardingProfileInput,
} from '../schemas/onboardingProfileSchema';
import { saveOnboardingProfileAction } from '../actions/saveOnboardingProfileAction';
import { verifyCompanyConnectionAction } from '../actions/verifyCompanyConnectionAction';
import { launchCompanyAction } from '../actions/launchCompanyAction';

interface Props {
  companySlug: string;
}

const TOTAL_STEPS = 4;

export function OnboardingWizardView({ companySlug }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [slug, setSlug] = useState(companySlug);
  const [verifySuccess, setVerifySuccess] = useState(false);

  return (
    <div>
      <StepperHeader currentStep={step} totalSteps={TOTAL_STEPS} />

      <div className="mt-6">
        {step === 1 && (
          <Step1ProfileForm
            onSuccess={(savedSlug) => {
              setSlug(savedSlug);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <Step2DriveSetup
            slug={slug}
            onContinue={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3VerifyConnection
            slug={slug}
            verifySuccess={verifySuccess}
            onVerifySuccess={() => setVerifySuccess(true)}
            onContinue={() => setStep(4)}
          />
        )}
        {step === 4 && <Step4Launch slug={slug} />}
      </div>
    </div>
  );
}

// ── Stepper header ────────────────────────────────────────────────────────────

function StepperHeader({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
        <div key={n} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              n < currentStep
                ? 'bg-green-500 text-white'
                : n === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
            }`}
          >
            {n < currentStep ? '✓' : n}
          </div>
          {n < totalSteps && (
            <div
              className={`h-0.5 w-8 ${n < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}
            />
          )}
        </div>
      ))}
      <span className="ml-2 text-sm text-gray-500">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
}

// ── Step 1 — Company Profile Form ─────────────────────────────────────────────

function Step1ProfileForm({ onSuccess }: { onSuccess: (slug: string) => void }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<OnboardingProfileInput>({
    resolver: zodResolver(onboardingProfileSchema),
    defaultValues: {
      primaryColor: '#3B82F6',
      secondaryColor: '#6B7280',
    },
  });

  const { execute, result, isPending } = useAction(saveOnboardingProfileAction);

  const primaryColor = watch('primaryColor');
  const secondaryColor = watch('secondaryColor');

  useEffect(() => {
    if (result.data?.success) {
      onSuccess(getValues('slug'));
    }
  }, [result.data, onSuccess, getValues]);

  function onSubmit(values: OnboardingProfileInput) {
    execute(values);
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Company Profile</h2>
      <p className="text-sm text-gray-500 mb-5">
        Tell us about your company so we can set up your career page.
      </p>

      {result.serverError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {result.serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Company Name" error={errors.name?.message}>
          <input
            {...register('name')}
            type="text"
            className={inputClass}
            placeholder="Acme Corp"
          />
        </Field>

        <Field label="Slug (URL-safe identifier)" error={errors.slug?.message}>
          <input
            {...register('slug')}
            type="text"
            className={inputClass}
            placeholder="acme-corp"
          />
          <p className="mt-1 text-xs text-gray-400">
            Lowercase letters, numbers, and hyphens only. Used in your career page URL.
          </p>
        </Field>

        <Field label="Logo URL" error={errors.logoUrl?.message}>
          <input
            {...register('logoUrl')}
            type="url"
            className={inputClass}
            placeholder="https://example.com/logo.png"
          />
        </Field>

        <Field label="Primary Color" error={errors.primaryColor?.message}>
          <div className="flex gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setValue('primaryColor', e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-gray-300 p-0.5"
            />
            <input
              {...register('primaryColor')}
              type="text"
              className={`flex-1 ${inputClass}`}
              placeholder="#3B82F6"
            />
          </div>
        </Field>

        <Field label="Secondary Color" error={errors.secondaryColor?.message}>
          <div className="flex gap-2">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setValue('secondaryColor', e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-gray-300 p-0.5"
            />
            <input
              {...register('secondaryColor')}
              type="text"
              className={`flex-1 ${inputClass}`}
              placeholder="#6B7280"
            />
          </div>
        </Field>

        <Field label="Contact Email" error={errors.contactEmail?.message}>
          <input
            {...register('contactEmail')}
            type="email"
            className={inputClass}
            placeholder="hr@example.com"
          />
        </Field>

        <Field label="WhatsApp Number" error={errors.whatsappNumber?.message}>
          <input
            {...register('whatsappNumber')}
            type="tel"
            className={inputClass}
            placeholder="+6281234567890"
          />
        </Field>

        <button type="submit" disabled={isPending} className={primaryButtonClass}>
          {isPending ? 'Saving...' : 'Save & Continue →'}
        </button>
      </form>
    </div>
  );
}

// ── Step 2 — Drive Setup Instructions ────────────────────────────────────────

function Step2DriveSetup({ slug, onContinue }: { slug: string; onContinue: () => void }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Set Up Google Drive</h2>
      <p className="text-sm text-gray-500 mb-5">
        Please complete the following steps in Google Drive before continuing.
      </p>

      <ul className="space-y-3 mb-6">
        <ChecklistItem>
          Create a folder named{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">{slug}-dir</code>{' '}
          inside the root Drive folder.
        </ChecklistItem>
        <ChecklistItem>
          Inside that folder, create a Google Sheet named{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">
            {slug}-database
          </code>
          .
        </ChecklistItem>
        <ChecklistItem>
          Add the following tabs to the sheet:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">Jobs</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">Candidates</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">Form_Logs</code>.
        </ChecklistItem>
      </ul>

      <button onClick={onContinue} className={primaryButtonClass}>
        I&apos;ve completed setup →
      </button>
    </div>
  );
}

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-gray-700">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-gray-300 bg-gray-50 text-gray-400">
        &#9633;
      </span>
      <span>{children}</span>
    </li>
  );
}

// ── Step 3 — Verify Connection ────────────────────────────────────────────────

function Step3VerifyConnection({
  slug,
  verifySuccess,
  onVerifySuccess,
  onContinue,
}: {
  slug: string;
  verifySuccess: boolean;
  onVerifySuccess: () => void;
  onContinue: () => void;
}) {
  const { execute, result, isPending } = useAction(verifyCompanyConnectionAction);

  useEffect(() => {
    if (result.data?.connected) {
      onVerifySuccess();
    }
  }, [result.data, onVerifySuccess]);

  function handleVerify() {
    execute({ slug });
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Verify Connection</h2>
      <p className="text-sm text-gray-500 mb-5">
        We&apos;ll check that your Google Drive structure is accessible. Your slug:{' '}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">{slug}</code>
      </p>

      {result.serverError && !verifySuccess && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {result.serverError}
        </div>
      )}

      {verifySuccess && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Connection verified successfully.
        </div>
      )}

      {!verifySuccess ? (
        <button onClick={handleVerify} disabled={isPending} className={primaryButtonClass}>
          {isPending ? 'Verifying...' : 'Verify Connection'}
        </button>
      ) : (
        <button onClick={onContinue} className={primaryButtonClass}>
          Continue →
        </button>
      )}

      {result.serverError && !verifySuccess && (
        <button
          onClick={handleVerify}
          disabled={isPending}
          className="mt-2 ml-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ── Step 4 — Confirm & Launch ─────────────────────────────────────────────────

function Step4Launch({ slug }: { slug: string }) {
  const { execute, result, isPending } = useAction(launchCompanyAction);

  function handleLaunch() {
    execute();
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Ready to Launch</h2>
      <p className="text-sm text-gray-500 mb-5">Your career page is ready to go live.</p>

      <div className="mb-5 rounded-lg bg-gray-50 border border-gray-200 p-4">
        <p className="text-sm text-gray-700">
          Career page slug:{' '}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs font-mono border border-gray-200">
            {slug}
          </code>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Clicking Launch will activate your career page and redirect you to the jobs dashboard.
        </p>
      </div>

      {result.serverError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {result.serverError}
        </div>
      )}

      <button onClick={handleLaunch} disabled={isPending} className={primaryButtonClass}>
        {isPending ? 'Launching...' : 'Launch Career Page'}
      </button>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500';

const primaryButtonClass =
  'rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
