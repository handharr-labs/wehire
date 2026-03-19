export type AdminRole = 'SUPER_ADMIN' | 'COMPANY_ADMIN';

export interface Admin {
  readonly adminId: string;
  readonly email: string;
  readonly hashedPassword: string;
  readonly role: AdminRole;
  readonly companyId: string | null;
}
