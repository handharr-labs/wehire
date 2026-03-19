import { cookies } from 'next/headers';
import { getAdminSession } from '@/lib/session';
import { logoutAdminAction } from '@/features/admin-auth/presentation/actions/logoutAdminAction';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = await getAdminSession(cookieStore);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Admin Dashboard</h1>

          {session && (
            <div className="space-y-2 text-sm text-gray-700 mb-6">
              <p>
                <span className="font-medium">Email:</span> {session.email}
              </p>
              <p>
                <span className="font-medium">Role:</span> {session.role}
              </p>
              {session.companyId && (
                <p>
                  <span className="font-medium">Company ID:</span> {session.companyId}
                </p>
              )}
            </div>
          )}

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
