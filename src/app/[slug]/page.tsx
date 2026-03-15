import { notFound } from 'next/navigation';
import { getCompanyBySlugUseCase, getJobsUseCase } from '@/di/container.server';
import { CareerPageView } from '@/features/career-microsite/presentation/career-page/CareerPageView';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CareerPage({ params }: Props) {
  const { slug } = await params;

  try {
    const company = await getCompanyBySlugUseCase.execute(slug);
    const jobs = await getJobsUseCase.execute(company.id);
    return <CareerPageView initialData={{ company, jobs }} />;
  } catch {
    notFound();
  }
}
