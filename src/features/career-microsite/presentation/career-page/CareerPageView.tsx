'use client';

import Link from 'next/link';
import { type CareerPageViewModelInput, buildCareerPageViewModel } from './buildCareerPageViewModel';

interface Props {
  initialData: CareerPageViewModelInput;
}

export function CareerPageView({ initialData }: Props) {
  const { company, jobs, isHiring } = buildCareerPageViewModel(initialData);

  return (
    <main className="min-h-screen bg-[#FAFAFC]">
      <header className="bg-[var(--brand-primary)] py-16">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center text-center">
          {company.logoUrl && (
            <div className="bg-white/15 rounded-2xl p-3 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={company.logoUrl} alt={company.name} className="h-12 w-auto object-contain" />
            </div>
          )}
          <h1 className="text-3xl font-bold text-[var(--brand-header-text)] tracking-tight">{company.name}</h1>
          {company.description && (
            <p className="mt-3 text-[var(--brand-header-text)] opacity-75 text-sm max-w-md leading-relaxed">{company.description}</p>
          )}
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">
          Open Positions
          {isHiring && jobs.length > 0 && (
            <span className="ml-2 text-sm font-medium text-[#5E5E7A]">({jobs.length})</span>
          )}
        </h2>

        {!isHiring ? (
          <div className="bg-white rounded-xl border border-[#E8E8F0] p-10 text-center">
            <p className="text-[#5E5E7A] text-sm">This company is not currently hiring.</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E8E8F0] p-10 text-center">
            <p className="text-[#5E5E7A] text-sm">No open positions at the moment. Check back soon.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/${company.slug}/jobs/${job.id}`}
                  className="group flex items-center justify-between bg-white rounded-xl border border-[#E8E8F0] p-6 hover:border-[var(--brand-primary)] hover:shadow-md transition-all"
                >
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] group-hover:text-[var(--brand-primary)] transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-[#F5F5F8] text-[#5E5E7A] text-xs px-2.5 py-1 rounded-full">{job.department}</span>
                      <span className="bg-[#F5F5F8] text-[#5E5E7A] text-xs px-2.5 py-1 rounded-full">{job.location}</span>
                      <span className="bg-[#F5F5F8] text-[#5E5E7A] text-xs px-2.5 py-1 rounded-full capitalize">{job.employmentType}</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-[#5E5E7A] group-hover:text-[var(--brand-primary)] shrink-0 ml-4 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
