export interface PasswordVerifier {
  compare(plain: string, hashed: string): boolean;
}
