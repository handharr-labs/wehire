export interface AdminDTO {
  admin_id: string;
  email: string;
  hashed_password: string;
  role: string;
  company_id: string | null;
}
