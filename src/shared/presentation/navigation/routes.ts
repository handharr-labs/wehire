// presentation/navigation/routes.ts
export const ROUTES = {
  home: '/',

  // [company].wehire routes — filled in when feature is scaffolded
  careerPage: (slug: string) => `/${slug}`,
  jobDetail: (slug: string, jobId: string) => `/${slug}/jobs/${jobId}`,
  applyJob: (slug: string, jobId: string) => `/${slug}/jobs/${jobId}/apply`,
  applySuccess: (slug: string, jobId: string) => `/${slug}/jobs/${jobId}/apply/success`,
} as const;
