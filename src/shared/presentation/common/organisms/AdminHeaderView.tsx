'use client';

import { AdminHeader } from './AdminHeader';
import { useAdminHeaderViewModel } from '../viewmodels/useAdminHeaderViewModel';

interface AdminHeaderSession {
  email: string;
  role: string;
}

interface Props {
  session: AdminHeaderSession | null;
}

export function AdminHeaderView({ session }: Props) {
  const { onLogout, isPending } = useAdminHeaderViewModel();

  return <AdminHeader session={session} onLogout={onLogout} isPending={isPending} />;
}
