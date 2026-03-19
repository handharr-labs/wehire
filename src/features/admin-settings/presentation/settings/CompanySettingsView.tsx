'use client';

import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { updateCompanySettingsAction } from '../actions/updateCompanySettingsAction';
import {
  companySettingsFormSchema,
  type CompanySettingsFormValues,
} from './companySettingsFormSchema';

interface Props {
  defaultValues: Company;
  companyId: string;
}

export function CompanySettingsView({ defaultValues, companyId }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsFormSchema),
    defaultValues: {
      name: defaultValues.name,
      logoUrl: defaultValues.logoUrl,
      primaryColor: defaultValues.primaryColor,
      secondaryColor: defaultValues.secondaryColor,
      description: defaultValues.description,
      contactEmail: defaultValues.contactEmail,
      whatsappNumber: defaultValues.whatsappNumber,
      siteStatus: defaultValues.siteStatus,
    },
  });

  const { execute, result, isPending } = useAction(updateCompanySettingsAction);

  const primaryColor = watch('primaryColor');
  const secondaryColor = watch('secondaryColor');

  function onSubmit(values: CompanySettingsFormValues) {
    execute({ ...values, companyId });
  }

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Company Settings</h1>

          {result.serverError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
              {result.serverError}
            </div>
          )}

          {result.data !== undefined && !result.serverError && (
            <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-sm text-green-700">
              Settings saved successfully.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Company Name" error={errors.name?.message}>
              <input
                {...register('name')}
                type="text"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Acme Corp"
              />
            </Field>

            <Field label="Logo URL" error={errors.logoUrl?.message}>
              <input
                {...register('logoUrl')}
                type="url"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
            </Field>

            <Field label="Primary Color" error={errors.primaryColor?.message}>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setValue('primaryColor', e.target.value)}
                  className="h-9 w-12 rounded border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  {...register('primaryColor')}
                  type="text"
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="h-9 w-12 rounded border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  {...register('secondaryColor')}
                  type="text"
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#6B7280"
                />
              </div>
            </Field>

            <Field label="Description" error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell candidates about your company"
              />
            </Field>

            <Field label="Contact Email" error={errors.contactEmail?.message}>
              <input
                {...register('contactEmail')}
                type="email"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="hr@example.com"
              />
            </Field>

            <Field label="WhatsApp Number" error={errors.whatsappNumber?.message}>
              <input
                {...register('whatsappNumber')}
                type="tel"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+6281234567890"
              />
            </Field>

            <Field label="Site Status" error={errors.siteStatus?.message}>
              <select {...register('siteStatus')} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
            >
              {isPending ? 'Saving…' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
