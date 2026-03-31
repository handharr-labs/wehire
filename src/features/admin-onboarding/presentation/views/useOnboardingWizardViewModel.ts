'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
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

export function useOnboardingWizardViewModel({ companySlug }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [slug, setSlug] = useState(companySlug);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // ── Step 1 ────────────────────────────────────────────────────────────────
  const step1Form = useForm<OnboardingProfileInput>({
    resolver: zodResolver(onboardingProfileSchema),
    defaultValues: { primaryColor: '#3B82F6', secondaryColor: '#6B7280' },
  });

  const {
    execute: step1Execute,
    result: step1Result,
    isPending: step1Pending,
  } = useAction(saveOnboardingProfileAction, {
    onSuccess: () => {
      const savedSlug = step1Form.getValues('slug');
      setSlug(savedSlug);
      setStep(2);
    },
  });

  const step1PrimaryColor = step1Form.watch('primaryColor');
  const step1SecondaryColor = step1Form.watch('secondaryColor');

  // ── Step 3 ────────────────────────────────────────────────────────────────
  const {
    execute: verifyExecute,
    result: verifyResult,
    isPending: verifyPending,
  } = useAction(verifyCompanyConnectionAction, {
    onSuccess: ({ data }) => {
      if (data?.connected) setVerifySuccess(true);
    },
  });

  function handleVerify() {
    verifyExecute({ slug });
  }

  // ── Step 4 ────────────────────────────────────────────────────────────────
  const {
    execute: launchExecute,
    result: launchResult,
    isPending: launchPending,
  } = useAction(launchCompanyAction, {
    onSuccess: ({ data }) => {
      if (data?.redirectTo) router.push(data.redirectTo);
    },
  });

  // ── Navigation ────────────────────────────────────────────────────────────
  function goToStep(n: 1 | 2 | 3 | 4) {
    setStep(n);
  }

  return {
    step,
    slug,
    goToStep,
    step1: {
      fields: {
        name: step1Form.register('name'),
        slug: step1Form.register('slug'),
        logoUrl: step1Form.register('logoUrl'),
        primaryColor: step1Form.register('primaryColor'),
        secondaryColor: step1Form.register('secondaryColor'),
        contactEmail: step1Form.register('contactEmail'),
        whatsappNumber: step1Form.register('whatsappNumber'),
      },
      fieldErrors: {
        name: step1Form.formState.errors.name?.message,
        slug: step1Form.formState.errors.slug?.message,
        logoUrl: step1Form.formState.errors.logoUrl?.message,
        primaryColor: step1Form.formState.errors.primaryColor?.message,
        secondaryColor: step1Form.formState.errors.secondaryColor?.message,
        contactEmail: step1Form.formState.errors.contactEmail?.message,
        whatsappNumber: step1Form.formState.errors.whatsappNumber?.message,
      },
      onSubmit: step1Form.handleSubmit((values) => step1Execute(values)),
      isPending: step1Pending,
      serverError: step1Result.serverError,
      primaryColor: step1PrimaryColor,
      secondaryColor: step1SecondaryColor,
      onPrimaryColorChange: (v: string) => step1Form.setValue('primaryColor', v),
      onSecondaryColorChange: (v: string) => step1Form.setValue('secondaryColor', v),
    },
    verify: {
      verifySuccess,
      onVerify: handleVerify,
      isPending: verifyPending,
      serverError: verifyResult.serverError,
    },
    launch: {
      onLaunch: () => launchExecute(),
      isPending: launchPending,
      serverError: launchResult.serverError,
    },
  };
}
