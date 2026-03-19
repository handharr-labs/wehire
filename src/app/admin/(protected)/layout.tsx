import { AdminHeader } from '@/features/admin-settings/presentation/layout/AdminHeader';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminHeader />
      <main>{children}</main>
    </>
  );
}
