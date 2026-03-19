'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { type Job } from '@/features/career-microsite/domain/entities/Job';
import { jobFormSchema, type JobFormValues } from './jobFormSchema';
import { createJobAction } from './actions/createJobAction';
import { updateJobAction } from './actions/updateJobAction';

interface Props {
  companyId: string;
  job?: Job;
  mode: 'create' | 'edit';
}

export function JobFormView({ companyId, job, mode }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job?.title ?? '',
      department: job?.department ?? '',
      location: job?.location ?? '',
      employmentType: job?.employmentType ?? 'full-time',
      minSalary: job?.minSalary ?? 0,
      maxSalary: job?.maxSalary ?? 0,
      description: job?.description ?? '',
      requirements: job?.requirements ?? '',
      status: job?.status ?? 'draft',
      expiredAt: job?.expiredAt ? job.expiredAt.substring(0, 10) : '',
      sortOrder: job?.sortOrder ?? 0,
    },
  });

  const { execute: executeCreate, result: createResult, isPending: isCreating } = useAction(createJobAction, {
    onSuccess: () => router.push('/admin/jobs'),
  });

  const { execute: executeUpdate, result: updateResult, isPending: isUpdating } = useAction(updateJobAction, {
    onSuccess: () => router.push('/admin/jobs'),
  });

  const isPending = isCreating || isUpdating;
  const serverError = createResult.serverError ?? updateResult.serverError;

  function onSubmit(values: JobFormValues) {
    if (mode === 'create') {
      executeCreate({ ...values, companyId });
    } else {
      executeUpdate({ ...values, companyId, jobId: job!.id });
    }
  }

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {mode === 'create' ? 'New Job Posting' : 'Edit Job Posting'}
          </h1>

          {serverError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Job Title" error={errors.title?.message}>
              <input
                {...register('title')}
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <Field label="Department" error={errors.department?.message}>
              <input
                {...register('department')}
                type="text"
                placeholder="e.g. Engineering"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <Field label="Location" error={errors.location?.message}>
              <input
                {...register('location')}
                type="text"
                placeholder="e.g. Jakarta / Remote"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <Field label="Employment Type" error={errors.employmentType?.message}>
              <select
                {...register('employmentType')}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Min Salary (IDR)" error={errors.minSalary?.message}>
                <input
                  {...register('minSalary')}
                  type="number"
                  min={0}
                  placeholder="5000000"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Field>

              <Field label="Max Salary (IDR)" error={errors.maxSalary?.message}>
                <input
                  {...register('maxSalary')}
                  type="number"
                  min={0}
                  placeholder="10000000"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Field>
            </div>

            <Field label="Description" error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Describe the role and responsibilities"
                className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <Field label="Requirements" error={errors.requirements?.message}>
              <textarea
                {...register('requirements')}
                rows={5}
                placeholder="List candidate requirements"
                className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Status" error={errors.status?.message}>
                <select
                  {...register('status')}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </Field>

              <Field label="Expiry Date" error={errors.expiredAt?.message}>
                <input
                  {...register('expiredAt')}
                  type="date"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Field>
            </div>

            <Field label="Sort Order" error={errors.sortOrder?.message}>
              <input
                {...register('sortOrder')}
                type="number"
                min={0}
                placeholder="0"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
            >
              {isPending
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
