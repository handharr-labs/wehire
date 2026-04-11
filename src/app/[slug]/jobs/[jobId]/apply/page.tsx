import { notFound, redirect } from 'next/navigation';
import { getCachedCompanyBySlug, getCachedJobDetailBySlug } from '@/di/cachedQueries';
import { getFormFieldsUseCase } from '@/di/container.server';
import { ApplyFormClientWrapper } from './ApplyFormClientWrapper';
import { BrandThemeStyle } from '@/shared/presentation/common/atoms/BrandThemeStyle';
import { isJobOpen } from '@/features/career-microsite/domain/helpers/isJobOpen';
import { type Company } from '@/shared/domain/entities/Company';
import { type Job } from '@/shared/domain/entities/Job';

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
  if (!isJobOpen(job, new Date())) redirect(`/${slug}/jobs/${jobId}`);

  // Fetch enabled form fields; fall back to empty array so the page still renders
  // with a degraded form if the Form_Fields sheet hasn't been seeded yet.
  let formFields = await getFormFieldsUseCase.execute(company.id).catch(() => []);
  // If no fields returned yet (brand new company), use an empty list — the
  // ApplyFormView will show nothing until the admin configures fields, which is
  // fine for MVP (the sheet will be seeded on first admin visit).
  formFields = formFields.filter((f) => f.enabled).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <BrandThemeStyle primaryColor={company.primaryColor} secondaryColor={company.secondaryColor} />
      <ApplyFormClientWrapper company={company} job={job} formFields={formFields} />
    </>
  );
}
