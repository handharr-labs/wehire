'use client';

import { FormField } from '@/shared/presentation/common/atoms/FormField';

interface Fields {
  name: React.InputHTMLAttributes<HTMLInputElement>;
  slug: React.InputHTMLAttributes<HTMLInputElement>;
  logoUrl: React.InputHTMLAttributes<HTMLInputElement>;
  primaryColor: React.InputHTMLAttributes<HTMLInputElement>;
  secondaryColor: React.InputHTMLAttributes<HTMLInputElement>;
  contactEmail: React.InputHTMLAttributes<HTMLInputElement>;
  whatsappNumber: React.InputHTMLAttributes<HTMLInputElement>;
}

interface Props {
  fields: Fields;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  fieldErrors: Record<string, string | undefined>;
  isPending: boolean;
  serverError: string | undefined;
  primaryColor: string;
  secondaryColor: string;
  onPrimaryColorChange: (v: string) => void;
  onSecondaryColorChange: (v: string) => void;
}

const inputClass =
  'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500';

const primaryButtonClass =
  'rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors';

export function Step1ProfileFormOrganism({
  fields,
  onSubmit,
  fieldErrors,
  isPending,
  serverError,
  primaryColor,
  secondaryColor,
  onPrimaryColorChange,
  onSecondaryColorChange,
}: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Company Profile</h2>
      <p className="text-sm text-gray-500 mb-5">
        Tell us about your company so we can set up your career page.
      </p>

      {serverError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Company Name" error={fieldErrors.name}>
          <input
            {...fields.name}
            type="text"
            className={inputClass}
            placeholder="Acme Corp"
          />
        </FormField>

        <FormField label="Slug (URL-safe identifier)" error={fieldErrors.slug}>
          <input
            {...fields.slug}
            type="text"
            className={inputClass}
            placeholder="acme-corp"
          />
          <p className="mt-1 text-xs text-gray-400">
            Lowercase letters, numbers, and hyphens only. Used in your career page URL.
          </p>
        </FormField>

        <FormField label="Logo URL" error={fieldErrors.logoUrl}>
          <input
            {...fields.logoUrl}
            type="url"
            className={inputClass}
            placeholder="https://example.com/logo.png"
          />
        </FormField>

        <FormField label="Primary Color" error={fieldErrors.primaryColor}>
          <div className="flex gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => onPrimaryColorChange(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-gray-300 p-0.5"
            />
            <input
              {...fields.primaryColor}
              type="text"
              className={`flex-1 ${inputClass}`}
              placeholder="#3B82F6"
            />
          </div>
        </FormField>

        <FormField label="Secondary Color" error={fieldErrors.secondaryColor}>
          <div className="flex gap-2">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => onSecondaryColorChange(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-gray-300 p-0.5"
            />
            <input
              {...fields.secondaryColor}
              type="text"
              className={`flex-1 ${inputClass}`}
              placeholder="#6B7280"
            />
          </div>
        </FormField>

        <FormField label="Contact Email" error={fieldErrors.contactEmail}>
          <input
            {...fields.contactEmail}
            type="email"
            className={inputClass}
            placeholder="hr@example.com"
          />
        </FormField>

        <FormField label="WhatsApp Number" error={fieldErrors.whatsappNumber}>
          <input
            {...fields.whatsappNumber}
            type="tel"
            className={inputClass}
            placeholder="+6281234567890"
          />
        </FormField>

        <button type="submit" disabled={isPending} className={primaryButtonClass}>
          {isPending ? 'Saving...' : 'Save & Continue →'}
        </button>
      </form>
    </div>
  );
}
