import { AdminHeader } from '@/features/admin-settings/presentation/organisms/AdminHeader';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminHeader />
      <main>{children}</main>
    </>
  );
}
