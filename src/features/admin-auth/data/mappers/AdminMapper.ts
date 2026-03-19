import { type Admin, type AdminRole } from '../../domain/entities/Admin';
import { type AdminDTO } from '../dtos/AdminDTO';

export class AdminMapper {
  static toDomain(dto: AdminDTO): Admin {
    return {
      adminId: dto.admin_id,
      email: dto.email,
      hashedPassword: dto.hashed_password,
      role: dto.role as AdminRole,
      companyId: dto.company_id || null,
    };
  }
}
