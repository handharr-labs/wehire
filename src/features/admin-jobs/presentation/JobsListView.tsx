import Link from 'next/link';
import { type Job } from '@/features/career-microsite/domain/entities/Job';
import { DeleteJobDialog } from './DeleteJobDialog';

interface Props {
  jobs: Job[];
  companyId: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  closed: 'bg-red-100 text-red-700',
};

function formatSalary(amount: number): string {
  if (amount === 0) return '—';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function JobsListView({ jobs, companyId }: Props) {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Job Postings</h1>
            <Link
              href="/admin/jobs/new"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
            >
              + New Job
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-500">
              No job postings yet.{' '}
              <Link href="/admin/jobs/new" className="text-blue-600 hover:underline">
                Create your first one.
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Salary Range</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Expires</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                      <td className="px-6 py-4 text-gray-600">{job.department}</td>
                      <td className="px-6 py-4 text-gray-600">{job.location}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatSalary(job.minSalary)} – {formatSalary(job.maxSalary)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[job.status] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {job.expiredAt ? job.expiredAt.substring(0, 10) : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/jobs/${job.id}/edit`}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            Edit
                          </Link>
                          <DeleteJobDialog
                            jobId={job.id}
                            jobTitle={job.title}
                            companyId={companyId}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
