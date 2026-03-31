import { cookies } from 'next/headers';
import { getAdminSession } from '@/lib/session';
import { AdminHeader } from '@/shared/presentation/common/organisms/AdminHeader';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await getAdminSession(cookieStore);

  return (
    <>
      <AdminHeader session={session} />
      <main>{children}</main>
    </>
  );
}
