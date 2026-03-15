// data/networking/TokenProvider.ts
export interface TokenProvider {
  getAccessToken(): string | null;
}

export interface TokenRefresher {
  refreshToken(): Promise<void>;
}

export interface TokenStorage extends TokenProvider {
  getRefreshToken(): string | null;
  saveAccessToken(token: string): void;
  saveRefreshToken(token: string): void;
  getTokenExpiration(): Date | null;
}
