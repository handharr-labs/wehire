'use client';

import Link from 'next/link';
import { type Job } from '@/features/career-microsite/domain/entities/Job';
import { useJobFormViewModel } from './useJobFormViewModel';
import { FormField } from '@/shared/presentation/common/atoms/FormField';

interface Props {
  companyId: string;
  job?: Job;
  mode: 'create' | 'edit';
}

export function JobFormView({ companyId, job, mode }: Props) {
  const vm = useJobFormViewModel({ companyId, job, mode });

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Link href={vm.jobsHref} className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Jobs
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {mode === 'create' ? 'New Job Posting' : 'Edit Job Posting'}
          </h1>

          {vm.serverError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
              {vm.serverError}
            </div>
          )}

          <form onSubmit={vm.onFormSubmit} className="space-y-5">
            <FormField label="Job Title" error={vm.fieldErrors.title}>
              <input
                {...vm.fields.title}
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <FormField label="Department" error={vm.fieldErrors.department}>
              <input
                {...vm.fields.department}
                type="text"
                placeholder="e.g. Engineering"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <FormField label="Location" error={vm.fieldErrors.location}>
              <input
                {...vm.fields.location}
                type="text"
                placeholder="e.g. Jakarta / Remote"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <FormField label="Employment Type" error={vm.fieldErrors.employmentType}>
              <select
                {...vm.fields.employmentType}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Min Salary (IDR)" error={vm.fieldErrors.minSalary}>
                <input
                  {...vm.fields.minSalary}
                  type="number"
                  min={0}
                  placeholder="5000000"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>

              <FormField label="Max Salary (IDR)" error={vm.fieldErrors.maxSalary}>
                <input
                  {...vm.fields.maxSalary}
                  type="number"
                  min={0}
                  placeholder="10000000"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>
            </div>

            <FormField label="Description" error={vm.fieldErrors.description}>
              <textarea
                {...vm.fields.description}
                rows={5}
                placeholder="Describe the role and responsibilities"
                className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <FormField label="Requirements" error={vm.fieldErrors.requirements}>
              <textarea
                {...vm.fields.requirements}
                rows={5}
                placeholder="List candidate requirements"
                className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Status" error={vm.fieldErrors.status}>
                <select
                  {...vm.fields.status}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </FormField>

              <FormField label="Expiry Date" error={vm.fieldErrors.expiredAt}>
                <input
                  {...vm.fields.expiredAt}
                  type="date"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>
            </div>

            <FormField label="Sort Order" error={vm.fieldErrors.sortOrder}>
              <input
                {...vm.fields.sortOrder}
                type="number"
                min={0}
                placeholder="0"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <button
              type="submit"
              disabled={vm.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
            >
              {vm.isPending
                ? mode === 'create'
                  ? 'Creating…'
                  : 'Saving…'
                : mode === 'create'
                  ? 'Create Job'
                  : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
