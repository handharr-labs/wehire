import { notFound } from 'next/navigation';
import { getCompanyBySlugUseCase, getJobDetailUseCase } from '@/di/container.server';
import { ApplyFormClientWrapper } from './ApplyFormClientWrapper';
import { BrandThemeStyle } from '@/features/career-microsite/presentation/shared/BrandThemeStyle';
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
      getCompanyBySlugUseCase.execute(slug),
      getJobDetailUseCase.execute(jobId),
    ]);
  } catch {
    notFound();
  }

  return (
    <>
      <BrandThemeStyle primaryColor={company.primaryColor} secondaryColor={company.secondaryColor} />
      <ApplyFormClientWrapper company={company} job={job} />
    </>
  );
}
