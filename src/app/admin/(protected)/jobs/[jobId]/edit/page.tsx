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

  return <JobFormView companyId={companyId} job={job} mode="edit" />;
}
