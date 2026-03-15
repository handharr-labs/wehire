import { notFound } from 'next/navigation';
import { getCompanyBySlugUseCase, getJobDetailUseCase } from '@/di/container.server';
import { JobDetailView } from '@/features/career-microsite/presentation/job-detail/JobDetailView';

interface Props {
  params: Promise<{ slug: string; jobId: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { slug, jobId } = await params;

  try {
    const [company, job] = await Promise.all([
      getCompanyBySlugUseCase.execute(slug),
      getJobDetailUseCase.execute(jobId),
    ]);

    return <JobDetailView initialData={{ company, job }} />;
  } catch {
    notFound();
  }
}
