import { notFound, redirect } from 'next/navigation';
import { getCompanyBySlugUseCase, getJobDetailUseCase } from '@/di/container.server';
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
    company = await getCompanyBySlugUseCase.execute(slug);
    job = await getJobDetailUseCase.execute(jobId, company.id);
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
