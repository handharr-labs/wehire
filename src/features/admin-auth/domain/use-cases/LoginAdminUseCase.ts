import { DomainError } from '@/shared/domain/errors/DomainError';
import { type AdminRepository } from '../repositories/AdminRepository';
import { type PasswordVerifier } from '../services/PasswordVerifier';
import { type AdminSession } from '../entities/AdminSession';

export interface LoginAdminInput {
  readonly email: string;
  readonly password: string;
}

export interface LoginAdminUseCase {
  execute(input: LoginAdminInput): Promise<AdminSession>;
}

export class LoginAdminUseCaseImpl implements LoginAdminUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly passwordVerifier: PasswordVerifier,
  ) {}

  async execute({ email, password }: LoginAdminInput): Promise<AdminSession> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) throw DomainError.unauthorized();

    const isValid = await this.passwordVerifier.compare(password, admin.hashedPassword);
    if (!isValid) throw DomainError.unauthorized();

    return {
      adminId: admin.adminId,
      email: admin.email,
      role: admin.role,
      companyId: admin.companyId,
    };
  }
}
