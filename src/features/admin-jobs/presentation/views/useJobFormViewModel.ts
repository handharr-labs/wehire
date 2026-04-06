'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { type Job } from '@/shared/domain/entities/Job';
import { jobFormSchema, type JobFormValues } from '../schemas/jobFormSchema';
import { createJobAction } from '../actions/createJobAction';
import { updateJobAction } from '../actions/updateJobAction';

interface Props {
  companyId: string;
  job?: Job;
  mode: 'create' | 'edit';
}

export function useJobFormViewModel({ companyId, job, mode }: Props) {
  const router = useRouter();
  const jobsHref = `/admin/jobs?companyId=${companyId}`;

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
    onSuccess: () => router.push(jobsHref),
  });

  const { execute: executeUpdate, result: updateResult, isPending: isUpdating } = useAction(updateJobAction, {
    onSuccess: () => router.push(jobsHref),
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

  return {
    fields: {
      title: register('title'),
      department: register('department'),
      location: register('location'),
      employmentType: register('employmentType'),
      minSalary: register('minSalary', { valueAsNumber: true }),
      maxSalary: register('maxSalary', { valueAsNumber: true }),
      description: register('description'),
      requirements: register('requirements'),
      status: register('status'),
      expiredAt: register('expiredAt'),
      sortOrder: register('sortOrder', { valueAsNumber: true }),
    },
    fieldErrors: {
      title: errors.title?.message,
      department: errors.department?.message,
      location: errors.location?.message,
      employmentType: errors.employmentType?.message,
      minSalary: errors.minSalary?.message,
      maxSalary: errors.maxSalary?.message,
      description: errors.description?.message,
      requirements: errors.requirements?.message,
      status: errors.status?.message,
      expiredAt: errors.expiredAt?.message,
      sortOrder: errors.sortOrder?.message,
    },
    onFormSubmit: handleSubmit(onSubmit),
    isPending,
    serverError,
    jobsHref,
  };
}
