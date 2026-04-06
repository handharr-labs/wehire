'use client';

import { LogoutButton } from '@/shared/presentation/common/atoms/LogoutButton';

interface AdminHeaderSession {
  email: string;
  role: string;
}

interface Props {
  session: AdminHeaderSession | null;
  onLogout: () => void;
  isPending: boolean;
}

export function AdminHeader({ session, onLogout, isPending }: Props) {
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
            <LogoutButton onLogout={onLogout} isPending={isPending} />
          </div>
        )}
      </div>
    </header>
  );
}
