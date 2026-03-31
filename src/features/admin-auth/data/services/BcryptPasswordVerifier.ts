import bcrypt from 'bcryptjs';
import { type PasswordVerifier } from '../../domain/services/PasswordVerifier';

export class BcryptPasswordVerifierImpl implements PasswordVerifier {
  compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
