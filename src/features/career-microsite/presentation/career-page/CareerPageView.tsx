'use client';

import Link from 'next/link';
import { type CareerPageViewModel, useCareerPageViewModel } from './useCareerPageViewModel';

interface Props {
  initialData: CareerPageViewModel;
}

export function CareerPageView({ initialData }: Props) {
  const { company, jobs } = useCareerPageViewModel(initialData);

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {company.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.logoUrl} alt={company.name} className="h-12 object-contain mb-4" />
          )}
          <h1 className="text-2xl font-bold text-zinc-900">{company.name}</h1>
          {company.description && (
            <p className="mt-2 text-zinc-600 text-sm">{company.description}</p>
          )}
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold text-zinc-800 mb-6">Open Positions</h2>

        {jobs.length === 0 ? (
          <p className="text-zinc-500 text-sm">No open positions at the moment.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="bg-white rounded-lg border border-zinc-200 p-5 hover:border-zinc-400 transition-colors">
                <Link href={`/${company.slug}/jobs/${job.id}`} className="block">
                  <h3 className="font-semibold text-zinc-900">{job.title}</h3>
                  <p className="text-sm text-zinc-500 mt-1">{job.department} · {job.location} · {job.employmentType}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
