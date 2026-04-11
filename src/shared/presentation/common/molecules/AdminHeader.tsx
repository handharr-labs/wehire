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

function formatRole(role: string): string {
  return role
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

export function AdminHeader({ session, onLogout, isPending }: Props) {
  const initial = session?.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold tracking-tight">W</span>
          </div>
          <span className="text-sm font-bold text-gray-900 tracking-tight">WeHire</span>
          <span className="text-gray-300 select-none">·</span>
          <span className="text-sm text-gray-400 font-medium">Admin</span>
        </div>

        {/* User section */}
        {session && (
          <div className="flex items-center gap-3">
            {/* Avatar + identity */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 ring-1 ring-indigo-200">
                {initial}
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-xs font-medium text-gray-800">{session.email}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{formatRole(session.role)}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-gray-200" />

            {/* Sign out */}
            <LogoutButton onLogout={onLogout} isPending={isPending} />
          </div>
        )}
      </div>
    </header>
  );
}
