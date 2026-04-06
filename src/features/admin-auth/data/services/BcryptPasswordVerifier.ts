import bcrypt from 'bcryptjs';
import { type PasswordVerifier } from '../../domain/services/PasswordVerifier';

export class BcryptPasswordVerifierImpl implements PasswordVerifier {
  compare(plain: string, hashed: string): boolean {
    return bcrypt.compareSync(plain, hashed);
  }
}
