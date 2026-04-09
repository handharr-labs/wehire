import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { AdminHeaderView } from '@/shared/presentation/common/organisms/AdminHeaderView';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await getAdminSession(cookieStore);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <>
      <AdminHeaderView session={session} />
      <main>{children}</main>
    </>
  );
}
