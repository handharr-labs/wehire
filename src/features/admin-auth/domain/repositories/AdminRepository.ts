import { type Admin } from '../entities/Admin';

export interface AdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
}
