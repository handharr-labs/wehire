'use client';

import { useOnboardingWizardViewModel } from './useOnboardingWizardViewModel';
import { Step1ProfileFormOrganism } from '../organisms/Step1ProfileFormOrganism';
import { Step2DriveSetupOrganism } from '../organisms/Step2DriveSetupOrganism';
import { Step3VerifyConnectionOrganism } from '../organisms/Step3VerifyConnectionOrganism';
import { Step4LaunchOrganism } from '../organisms/Step4LaunchOrganism';

interface Props {
  companySlug: string;
}

const TOTAL_STEPS = 4;

export function OnboardingWizardView({ companySlug }: Props) {
  const vm = useOnboardingWizardViewModel({ companySlug });

  return (
    <div>
      <StepperHeader currentStep={vm.step} totalSteps={TOTAL_STEPS} />

      <div className="mt-6">
        {vm.step === 1 && (
          <Step1ProfileFormOrganism
            fields={vm.step1.fields}
            onSubmit={vm.step1.onSubmit}
            fieldErrors={vm.step1.fieldErrors}
            isPending={vm.step1.isPending}
            serverError={vm.step1.serverError}
            primaryColor={vm.step1.primaryColor}
            secondaryColor={vm.step1.secondaryColor}
            onPrimaryColorChange={vm.step1.onPrimaryColorChange}
            onSecondaryColorChange={vm.step1.onSecondaryColorChange}
          />
        )}
        {vm.step === 2 && (
          <Step2DriveSetupOrganism
            slug={vm.slug}
            onContinue={() => vm.goToStep(3)}
          />
        )}
        {vm.step === 3 && (
          <Step3VerifyConnectionOrganism
            slug={vm.slug}
            verifySuccess={vm.verify.verifySuccess}
            isPending={vm.verify.isPending}
            serverError={vm.verify.serverError}
            onVerify={vm.verify.onVerify}
            onContinue={() => vm.goToStep(4)}
          />
        )}
        {vm.step === 4 && (
          <Step4LaunchOrganism
            slug={vm.slug}
            isPending={vm.launch.isPending}
            serverError={vm.launch.serverError}
            onLaunch={vm.launch.onLaunch}
          />
        )}
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

