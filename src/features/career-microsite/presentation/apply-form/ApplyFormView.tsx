'use client';

import { useRouter } from 'next/navigation';
import { type Company } from '../../domain/entities/Company';
import { type Job } from '../../domain/entities/Job';
import { type SubmitApplicationUseCase } from '../../domain/use-cases/SubmitApplicationUseCase';
import { useApplyFormViewModel } from './useApplyFormViewModel';

interface Props {
  company: Company;
  job: Job;
  submitUseCase: SubmitApplicationUseCase;
}

export function ApplyFormView({ company, job, submitUseCase }: Props) {
  const router = useRouter();
  const { isSubmitting, error, handleSubmit } = useApplyFormViewModel(
    company,
    job,
    submitUseCase,
    () => router.push(`/${company.slug}/jobs/${job.id}/apply/success`),
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await handleSubmit(new FormData(e.currentTarget));
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Apply for {job.title}</h1>
        <p className="text-sm text-zinc-500 mb-8">{company.name}</p>

        <form onSubmit={onSubmit} className="bg-white rounded-lg border border-zinc-200 p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="fullName">Full Name *</label>
            <input id="fullName" name="fullName" type="text" required className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" required className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="phone">Phone *</label>
            <input id="phone" name="phone" type="tel" required className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="city">City *</label>
            <input id="city" name="city" type="text" required className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="experienceSummary">Experience Summary *</label>
            <textarea id="experienceSummary" name="experienceSummary" required rows={4} className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="expectedSalary">Expected Salary (IDR) *</label>
            <input id="expectedSalary" name="expectedSalary" type="number" required min={0} className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="cvFile">CV / Resume *</label>
            <input id="cvFile" name="cvFile" type="file" required accept=".pdf,.doc,.docx" className="w-full text-sm text-zinc-600" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="linkedinUrl">LinkedIn URL</label>
            <input id="linkedinUrl" name="linkedinUrl" type="url" className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="portfolioUrl">Portfolio URL</label>
            <input id="portfolioUrl" name="portfolioUrl" type="url" className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="coverLetter">Cover Letter</label>
            <textarea id="coverLetter" name="coverLetter" rows={4} className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400" />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </main>
  );
}
