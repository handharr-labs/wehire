import { notFound } from 'next/navigation';
import { getCachedCompanyBySlug, getCachedJobsByCompanyId } from '@/lib/cached-queries';
import { CareerPageView } from '@/features/career-microsite/presentation/career-page/CareerPageView';
import { BrandThemeStyle } from '@/shared/presentation/common/atoms/BrandThemeStyle';
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
    company = await getCachedCompanyBySlug(slug);
    jobs = await getCachedJobsByCompanyId(company.id);
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
