export type SiteStatus = 'active' | 'inactive';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  contactEmail: string;
  whatsappNumber: string;
  siteStatus: SiteStatus;
  maxActiveJobs: number;
}
