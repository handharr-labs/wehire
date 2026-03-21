import { cookies } from 'next/headers';
import { getAdminSession } from '@/lib/session';
import { logoutAdminAction } from '@/features/admin-auth/presentation/actions/logoutAdminAction';

export async function AdminHeader() {
  const cookieStore = await cookies();
  const session = await getAdminSession(cookieStore);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-8 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">WeHire Admin</span>

        {session && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{session.email}</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                session.role === 'SUPER_ADMIN'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {session.role}
            </span>
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
