export interface PasswordVerifier {
  // infra-exception: bcrypt is inherently async; this Promise return is intentional
  compare(plain: string, hashed: string): Promise<boolean>;
}
