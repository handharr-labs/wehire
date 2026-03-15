import { notFound } from 'next/navigation';
import { getCompanyBySlugUseCase, getJobDetailUseCase } from '@/di/container.server';
import { ApplyFormClientWrapper } from './ApplyFormClientWrapper';

interface Props {
  params: Promise<{ slug: string; jobId: string }>;
}

export default async function ApplyPage({ params }: Props) {
  const { slug, jobId } = await params;

  try {
    const [company, job] = await Promise.all([
      getCompanyBySlugUseCase.execute(slug),
      getJobDetailUseCase.execute(jobId),
    ]);

    return <ApplyFormClientWrapper company={company} job={job} />;
  } catch {
    notFound();
  }
}
