'use client';

import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { useCompanySettingsViewModel } from './useCompanySettingsViewModel';
import { FormField } from '@/shared/presentation/common/atoms/FormField';

interface Props {
  defaultValues: Company;
  companyId: string;
}

export function CompanySettingsView({ defaultValues, companyId }: Props) {
  const vm = useCompanySettingsViewModel({ defaultValues, companyId });

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Company Settings</h1>

          {vm.saveError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
              {vm.saveError}
            </div>
          )}

          {vm.saveSucceeded && (
            <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-sm text-green-700">
              Settings saved successfully.
            </div>
          )}

          <form onSubmit={vm.onFormSubmit} className="space-y-5">
            <FormField label="Company Name" error={vm.fieldErrors.name}>
              <input
                {...vm.fields.name}
                type="text"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Acme Corp"
              />
            </FormField>

            <FormField label="Logo URL" error={vm.fieldErrors.logoUrl}>
              <input
                {...vm.fields.logoUrl}
                type="url"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
            </FormField>

            <FormField label="Primary Color" error={vm.fieldErrors.primaryColor}>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={vm.primaryColor}
                  onChange={(e) => vm.onPrimaryColorChange(e.target.value)}
                  className="h-9 w-12 rounded border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  {...vm.fields.primaryColor}
                  type="text"
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#3B82F6"
                />
              </div>
            </FormField>

            <FormField label="Secondary Color" error={vm.fieldErrors.secondaryColor}>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={vm.secondaryColor}
                  onChange={(e) => vm.onSecondaryColorChange(e.target.value)}
                  className="h-9 w-12 rounded border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  {...vm.fields.secondaryColor}
                  type="text"
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#6B7280"
                />
              </div>
            </FormField>

            <FormField label="Description" error={vm.fieldErrors.description}>
              <textarea
                {...vm.fields.description}
                rows={3}
                className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell candidates about your company"
              />
            </FormField>

            <FormField label="Contact Email" error={vm.fieldErrors.contactEmail}>
              <input
                {...vm.fields.contactEmail}
                type="email"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="hr@example.com"
              />
            </FormField>

            <FormField label="WhatsApp Number" error={vm.fieldErrors.whatsappNumber}>
              <input
                {...vm.fields.whatsappNumber}
                type="tel"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+6281234567890"
              />
            </FormField>

            <FormField label="Site Status" error={vm.fieldErrors.siteStatus}>
              <select {...vm.fields.siteStatus} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FormField>

            <button
              type="submit"
              disabled={vm.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
            >
              {vm.isPending ? 'Saving…' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
