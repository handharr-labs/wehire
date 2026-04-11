'use client';

import Link from 'next/link';
import { type JobDetailViewModelInput, buildJobDetailViewModel } from './buildJobDetailViewModel';

interface Props {
  initialData: JobDetailViewModelInput;
}

export function JobDetailView({ initialData }: Props) {
  const { company, job, salaryLabel, isOpen } = buildJobDetailViewModel(initialData);

  return (
    <main className="min-h-screen bg-page">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href={`/${company.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          {company.name}
        </Link>

        <div className="bg-surface rounded-xl border border-stroke p-8 mb-6">
          <h1 className="text-3xl font-bold text-ink tracking-tight">{job.title}</h1>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-chip text-ink-muted text-xs px-2.5 py-1 rounded-full">{job.department}</span>
            <span className="bg-chip text-ink-muted text-xs px-2.5 py-1 rounded-full">{job.location}</span>
            <span className="bg-chip text-ink-muted text-xs px-2.5 py-1 rounded-full capitalize">{job.employmentType}</span>
            <span className="bg-accent-subtle text-accent text-xs px-2.5 py-1 rounded-full font-medium">{salaryLabel}</span>
          </div>

          <hr className="my-8 border-stroke" />

          <section>
            <h2 className="font-semibold text-ink text-lg mb-4">About the Role</h2>
            <p className="text-ink-muted text-sm whitespace-pre-line leading-relaxed">{job.description}</p>
          </section>

          <section className="mt-8">
            <h2 className="font-semibold text-ink text-lg mb-4">Requirements</h2>
            <p className="text-ink-muted text-sm whitespace-pre-line leading-relaxed">{job.requirements}</p>
          </section>

          <div className="mt-10">
            {isOpen ? (
              <Link
                href={`/${company.slug}/jobs/${job.id}/apply`}
                className="hidden md:inline-block bg-[var(--brand-primary)] text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--brand-secondary)] transition-colors"
              >
                Apply Now
              </Link>
            ) : (
              <p className="text-sm text-ink-muted">This position is no longer accepting applications.</p>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-0 inset-x-0 bg-surface border-t border-stroke p-4 md:hidden">
          <Link
            href={`/${company.slug}/jobs/${job.id}/apply`}
            className="block w-full bg-[var(--brand-primary)] text-white text-center py-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--brand-secondary)] transition-colors"
          >
            Apply Now
          </Link>
        </div>
      )}
    </main>
  );
}
