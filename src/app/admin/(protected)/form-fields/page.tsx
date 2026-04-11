import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { getFormFieldsUseCase } from '@/di/container.server';
import { FormFieldsManagerView } from '@/features/admin-form-fields/presentation/views/FormFieldsManagerView';

interface Props {
  searchParams: Promise<{ companyId?: string }>;
}

export default async function AdminFormFieldsPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const session = await getAdminSession(cookieStore);

  if (!session) {
    redirect('/admin/login');
  }

  const resolvedParams = await searchParams;

  if (session.role === 'SUPER_ADMIN' && !resolvedParams.companyId) {
    redirect('/admin/dashboard');
  }

  const companyId =
    session.role === 'SUPER_ADMIN' ? resolvedParams.companyId : (session.companyId ?? undefined);

  if (!companyId) {
    notFound();
  }

  const formFields = await getFormFieldsUseCase.execute(companyId);

  return (
    <>
      <div className="max-w-2xl mx-auto px-8 pt-6">
        <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back
        </Link>
      </div>
      <FormFieldsManagerView initialFields={formFields} companyId={companyId} />
    </>
  );
}
