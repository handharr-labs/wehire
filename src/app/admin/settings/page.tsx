import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { getCompanySettingsUseCase } from '@/di/container.server';
import { CompanySettingsView } from '@/features/admin-settings/presentation/settings/CompanySettingsView';

interface Props {
  searchParams: Promise<{ companyId?: string }>;
}

export default async function AdminSettingsPage({ searchParams }: Props) {
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

  const company = await getCompanySettingsUseCase.execute(companyId);

  return <CompanySettingsView defaultValues={company} companyId={companyId} />;
}
