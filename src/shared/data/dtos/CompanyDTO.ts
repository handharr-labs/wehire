export interface CompanyDTO {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly logo_url: string;
  readonly primary_color: string;
  readonly secondary_color: string;
  readonly description: string;
  readonly contact_email: string;
  readonly whatsapp_number: string;
  readonly site_status: string;
  readonly max_active_jobs: number;
  readonly scoring_enabled?: boolean;
}
