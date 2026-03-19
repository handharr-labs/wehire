import { DomainError } from '@/shared/domain/errors/DomainError';
import { type AdminRepository } from '../repositories/AdminRepository';
import { type PasswordVerifier } from '../services/PasswordVerifier';
import { type AdminSessionPayload } from '@/lib/session';

export interface LoginAdminInput {
  email: string;
  password: string;
}

export interface LoginAdminUseCase {
  execute(input: LoginAdminInput): Promise<AdminSessionPayload>;
}

export class LoginAdminUseCaseImpl implements LoginAdminUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly passwordVerifier: PasswordVerifier,
  ) {}

  async execute({ email, password }: LoginAdminInput): Promise<AdminSessionPayload> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) throw DomainError.unauthorized();

    const isValid = await this.passwordVerifier.compare(password, admin.hashedPassword);
    if (!isValid) throw DomainError.unauthorized();

    return {
      sub: admin.adminId,
      email: admin.email,
      role: admin.role,
      companyId: admin.companyId,
    };
  }
}
