import { type AdminRole } from './Admin';

export interface AdminSession {
  readonly adminId: string;
  readonly email: string;
  readonly role: AdminRole;
  readonly companyId: string | null;
}
