export interface AdminDTO {
  readonly admin_id: string;
  readonly email: string;
  readonly hashed_password: string;
  readonly role: string;
  readonly company_id: string | null;
}
