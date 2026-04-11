import { cookies } from 'next/headers';
import { getAdminSession } from '@/lib/session';
import { getCompanySettingsUseCase, listCompaniesUseCase } from '@/di/container.server';
import { AdminDashboardView } from '@/features/admin-settings/presentation/views/AdminDashboardView';
import { type Company } from '@/shared/domain/entities/Company';

type AdminSession = Awaited<ReturnType<typeof getAdminSession>>;

async function getAdminCompanies(session: AdminSession): Promise<Company[]> {
  if (session?.role === 'SUPER_ADMIN') return listCompaniesUseCase.execute();
  if (session?.companyId) {
    const company = await getCompanySettingsUseCase.execute(session.companyId);
    return [company];
  }
  return [];
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = await getAdminSession(cookieStore);

  const companies = await getAdminCompanies(session);

  const firstName = session?.email?.split('@')[0] ?? 'Admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {companies.length === 1
              ? 'Manage your company, jobs, and application form below.'
              : `You have access to ${companies.length} companies.`}
          </p>
        </div>

        {/* Company cards */}
        <AdminDashboardView companies={companies} />
      </div>
    </div>
  );
}
