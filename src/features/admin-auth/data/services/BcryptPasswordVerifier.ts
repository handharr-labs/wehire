import bcrypt from 'bcryptjs';
import { type PasswordVerifier } from '../../domain/services/PasswordVerifier';

export class BcryptPasswordVerifier implements PasswordVerifier {
  compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
