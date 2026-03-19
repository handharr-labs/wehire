import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { getCompanySettingsUseCase, listCompaniesUseCase } from '@/di/container.server';
import { CompanySettingsView } from '@/features/admin-settings/presentation/settings/CompanySettingsView';
import { CompanyPickerView } from '@/features/admin-settings/presentation/settings/CompanyPickerView';

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
    const companies = await listCompaniesUseCase.execute();
    return <CompanyPickerView companies={companies} />;
  }

  const companyId =
    session.role === 'SUPER_ADMIN' ? resolvedParams.companyId : (session.companyId ?? undefined);

  if (!companyId) {
    notFound();
  }

  const company = await getCompanySettingsUseCase.execute(companyId);

  return <CompanySettingsView defaultValues={company} companyId={companyId} />;
}
