import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { getAdminJobsUseCase } from '@/di/container.server';
import { JobsListView } from '@/features/admin-jobs/presentation/JobsListView';

interface Props {
  searchParams: Promise<{ companyId?: string }>;
}

export default async function AdminJobsPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const session = await getAdminSession(cookieStore);

  if (!session) {
    notFound();
  }

  const resolvedParams = await searchParams;

  if (session.role === 'SUPER_ADMIN' && !resolvedParams.companyId) {
    redirect('/admin/dashboard');
  }

  const companyId =
    session.role === 'SUPER_ADMIN' ? resolvedParams.companyId : (session.companyId ?? undefined);

  if (!companyId) {
    notFound();
  }

  const jobs = await getAdminJobsUseCase.execute(companyId);

  return <JobsListView jobs={jobs} companyId={companyId} />;
}
