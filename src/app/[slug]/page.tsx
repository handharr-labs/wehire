import { notFound } from 'next/navigation';
import { getCompanyBySlugUseCase, getJobsUseCase } from '@/di/container.server';
import { CareerPageView } from '@/features/career-microsite/presentation/career-page/CareerPageView';
import { BrandThemeStyle } from '@/features/career-microsite/presentation/shared/BrandThemeStyle';
import { isJobOpen } from '@/features/career-microsite/domain/helpers/isJobOpen';
import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { type Job } from '@/features/career-microsite/domain/entities/Job';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CareerPage({ params }: Props) {
  const { slug } = await params;

  let company: Company;
  let jobs: Job[];
  try {
    company = await getCompanyBySlugUseCase.execute(slug);
    jobs = await getJobsUseCase.execute(company.id);
  } catch {
    notFound();
  }

  const openJobs = jobs
    .filter(isJobOpen)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, company.maxActiveJobs);

  return (
    <>
      <BrandThemeStyle primaryColor={company.primaryColor} secondaryColor={company.secondaryColor} />
      <CareerPageView initialData={{ company, jobs: openJobs }} />
    </>
  );
}
