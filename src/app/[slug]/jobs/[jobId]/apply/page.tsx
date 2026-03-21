import { notFound, redirect } from 'next/navigation';
import { getCachedCompanyBySlug, getCachedJobDetailBySlug } from '@/lib/cached-queries';
import { ApplyFormClientWrapper } from './ApplyFormClientWrapper';
import { BrandThemeStyle } from '@/shared/presentation/common/atoms/BrandThemeStyle';
import { isJobOpen } from '@/features/career-microsite/domain/helpers/isJobOpen';
import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { type Job } from '@/features/career-microsite/domain/entities/Job';

interface Props {
  params: Promise<{ slug: string; jobId: string }>;
}

export default async function ApplyPage({ params }: Props) {
  const { slug, jobId } = await params;

  let company: Company;
  let job: Job;
  try {
    [company, job] = await Promise.all([
      getCachedCompanyBySlug(slug),
      getCachedJobDetailBySlug(jobId, slug),
    ]);
  } catch {
    notFound();
  }

  if (company.siteStatus !== 'active') redirect(`/${slug}`);
  if (!isJobOpen(job)) redirect(`/${slug}/jobs/${jobId}`);

  return (
    <>
      <BrandThemeStyle primaryColor={company.primaryColor} secondaryColor={company.secondaryColor} />
      <ApplyFormClientWrapper company={company} job={job} />
    </>
  );
}
