import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { getAdminJobDetailUseCase } from '@/di/container.server';
import { JobFormView } from '@/features/admin-jobs/presentation/JobFormView';

interface Props {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ companyId?: string }>;
}

export default async function EditJobPage({ params, searchParams }: Props) {
  const cookieStore = await cookies();
  const session = await getAdminSession(cookieStore);

  if (!session) {
    notFound();
  }

  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);

  if (session.role === 'SUPER_ADMIN' && !resolvedSearch.companyId) {
    redirect('/admin/dashboard');
  }

  const companyId =
    session.role === 'SUPER_ADMIN'
      ? resolvedSearch.companyId
      : (session.companyId ?? undefined);

  if (!companyId) {
    notFound();
  }

  const job = await getAdminJobDetailUseCase.execute(resolvedParams.jobId, companyId);

  return (
    <>
      <div className="max-w-2xl mx-auto px-8 pt-6">
        <Link href="/admin/jobs" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Jobs
        </Link>
      </div>
      <JobFormView companyId={companyId} job={job} mode="edit" />
    </>
  );
}
