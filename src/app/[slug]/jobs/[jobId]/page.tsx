import { notFound, redirect } from 'next/navigation';
import { getCachedCompanyBySlug, getCachedJobDetailBySlug } from '@/lib/cached-queries';
import { JobDetailView } from '@/features/career-microsite/presentation/job-detail/JobDetailView';
import { BrandThemeStyle } from '@/features/career-microsite/presentation/shared/BrandThemeStyle';
import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { type Job } from '@/features/career-microsite/domain/entities/Job';

interface Props {
  params: Promise<{ slug: string; jobId: string }>;
}

export default async function JobDetailPage({ params }: Props) {
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

  return (
    <>
      <BrandThemeStyle primaryColor={company.primaryColor} secondaryColor={company.secondaryColor} />
      <JobDetailView initialData={{ company, job }} />
    </>
  );
}
