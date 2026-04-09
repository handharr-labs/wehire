import { type SiteStatus } from '@/shared/domain/entities/Company';

export interface CompanySettingsInput {
  readonly name: string;
  readonly logoUrl: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly description: string;
  readonly contactEmail: string;
  readonly whatsappNumber: string;
  readonly siteStatus: SiteStatus;
}
