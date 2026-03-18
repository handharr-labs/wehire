'use client';

import Link from 'next/link';
import { type JobDetailViewModel, useJobDetailViewModel } from './useJobDetailViewModel';
import { isJobOpen } from '../../domain/helpers/isJobOpen';

interface Props {
  initialData: JobDetailViewModel;
}

export function JobDetailView({ initialData }: Props) {
  const { company, job } = useJobDetailViewModel(initialData);

  const salaryLabel =
    job.minSalary > 0
      ? `Rp ${job.minSalary.toLocaleString('id-ID')} – Rp ${job.maxSalary.toLocaleString('id-ID')}`
      : 'Negotiable';

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href={`/${company.slug}`} className="text-sm text-zinc-500 hover:text-zinc-800 mb-6 block">
          ← Back to {company.name}
        </Link>

        <div className="bg-white rounded-lg border border-zinc-200 p-8">
          <h1 className="text-2xl font-bold text-zinc-900">{job.title}</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {job.department} · {job.location} · {job.employmentType}
          </p>
          <p className="text-sm font-medium text-zinc-700 mt-2">{salaryLabel}</p>

          <hr className="my-6 border-zinc-100" />

          <section>
            <h2 className="font-semibold text-zinc-800 mb-3">Job Description</h2>
            <p className="text-zinc-600 text-sm whitespace-pre-line">{job.description}</p>
          </section>

          <section className="mt-6">
            <h2 className="font-semibold text-zinc-800 mb-3">Requirements</h2>
            <p className="text-zinc-600 text-sm whitespace-pre-line">{job.requirements}</p>
          </section>

          <div className="mt-8">
            {isJobOpen(job) ? (
              <Link
                href={`/${company.slug}/jobs/${job.id}/apply`}
                className="inline-block bg-[var(--brand-primary)] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[var(--brand-secondary)] transition-colors"
              >
                Apply Now
              </Link>
            ) : (
              <p className="text-sm text-zinc-500">This position is no longer accepting applications.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
