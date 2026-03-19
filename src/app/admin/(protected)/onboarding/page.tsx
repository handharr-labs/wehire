import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { getCompanySettingsUseCase } from '@/di/container.server';
import { OnboardingWizardView } from '@/features/admin-onboarding/presentation/views/OnboardingWizardView';

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const session = await getAdminSession(cookieStore);

  if (!session) {
    redirect('/admin/login');
  }

  // SUPER_ADMIN doesn't need onboarding
  if (session.role === 'SUPER_ADMIN') {
    redirect('/admin/dashboard');
  }

  const companyId = session.companyId;
  if (!companyId) {
    redirect('/admin/login');
  }

  // Fetch current company state
  const company = await getCompanySettingsUseCase.execute(companyId);

  // Skip if already onboarded
  if (company.siteStatus === 'active') {
    redirect('/admin/jobs');
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Set up your company</h1>
      <OnboardingWizardView companySlug={company.slug ?? ''} />
    </div>
  );
}
