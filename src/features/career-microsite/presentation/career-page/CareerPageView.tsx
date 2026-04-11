'use client';

import Link from 'next/link';
import { type CareerPageViewModelInput, buildCareerPageViewModel } from './buildCareerPageViewModel';

interface Props {
  initialData: CareerPageViewModelInput;
}

export function CareerPageView({ initialData }: Props) {
  const { company, jobs, isHiring } = buildCareerPageViewModel(initialData);

  return (
    <main className="min-h-screen bg-page">
      <header className="relative bg-[var(--brand-primary)] py-20 overflow-hidden">
        {/* Dot grid texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="relative max-w-3xl mx-auto px-4 flex flex-col items-center text-center">
          {/* Logo or monogram fallback */}
          {company.logoUrl ? (
            <div className="bg-surface rounded-2xl p-4 mb-6 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={company.logoUrl} alt={company.name} className="h-12 w-auto object-contain" />
            </div>
          ) : (
            <div className="bg-white/20 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 text-2xl font-bold text-[var(--brand-header-text)]">
              {company.name.charAt(0)}
            </div>
          )}

          {/* "We're hiring" pill */}
          <div className="bg-white/20 text-[var(--brand-header-text)] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            We&apos;re hiring
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--brand-header-text)] tracking-tight">{company.name}</h1>
          {company.description && (
            <p className="mt-4 text-[var(--brand-header-text)] text-sm max-w-md leading-relaxed [text-shadow:0_1px_3px_rgba(0,0,0,0.15)]">{company.description}</p>
          )}
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-ink mb-6">
          Open Positions
          {isHiring && jobs.length > 0 && (
            <span className="ml-2 text-sm font-medium text-ink-muted">({jobs.length})</span>
          )}
        </h2>

        {!isHiring ? (
          <div className="bg-surface rounded-xl border border-stroke p-10 text-center">
            <p className="text-ink-muted text-sm">This company is not currently hiring.</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-surface rounded-xl border border-stroke p-10 text-center">
            <p className="text-ink-muted text-sm">No open positions at the moment. Check back soon.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/${company.slug}/jobs/${job.id}`}
                  className="group flex items-center justify-between bg-surface rounded-xl border border-stroke p-6 hover:border-[var(--brand-primary)] hover:shadow-md transition-all"
                >
                  <div>
                    <h3 className="font-semibold text-ink group-hover:text-[var(--brand-primary)] transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-chip text-ink-muted text-xs px-2.5 py-1 rounded-full">{job.department}</span>
                      <span className="bg-chip text-ink-muted text-xs px-2.5 py-1 rounded-full">{job.location}</span>
                      <span className="bg-chip text-ink-muted text-xs px-2.5 py-1 rounded-full capitalize">{job.employmentType}</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-ink-muted group-hover:text-[var(--brand-primary)] shrink-0 ml-4 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
