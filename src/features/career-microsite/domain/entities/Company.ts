export type SiteStatus = 'active' | 'inactive';

export interface Company {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly logoUrl: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly description: string;
  readonly contactEmail: string;
  readonly whatsappNumber: string;
  readonly siteStatus: SiteStatus;
  readonly maxActiveJobs: number;
}
