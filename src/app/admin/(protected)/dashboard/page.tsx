import Link from 'next/link';
import { cookies } from 'next/headers';
import { getAdminSession } from '@/lib/session';
import { listCompaniesUseCase } from '@/di/container.server';
import { CompanySelectorWidget } from '@/features/admin-settings/presentation/dashboard/CompanySelectorWidget';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = await getAdminSession(cookieStore);

  const companies =
    session?.role === 'SUPER_ADMIN' ? await listCompaniesUseCase.execute() : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Admin Dashboard</h1>

          <div className="flex gap-3 mb-4">
            {session?.role === 'SUPER_ADMIN' ? (
              <CompanySelectorWidget companies={companies} />
            ) : (
              <>
                <Link
                  href="/admin/jobs"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
                >
                  Manage Jobs
                </Link>
                <Link
                  href="/admin/settings"
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-sm font-medium rounded px-4 py-2 transition-colors"
                >
                  Settings
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
