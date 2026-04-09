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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Admin Dashboard</h1>

          <div className="flex gap-3 mb-4">
            <AdminDashboardView
              companies={companies}
              readonly={session?.role !== 'SUPER_ADMIN'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
