import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { JobFormView } from '@/features/admin-jobs/presentation/JobFormView';

interface Props {
  searchParams: Promise<{ companyId?: string }>;
}

export default async function NewJobPage({ searchParams }: Props) {
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

  return (
    <>
      <div className="max-w-2xl mx-auto px-8 pt-6">
        <Link href="/admin/jobs" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Jobs
        </Link>
      </div>
      <JobFormView companyId={companyId} mode="create" />
    </>
  );
}
