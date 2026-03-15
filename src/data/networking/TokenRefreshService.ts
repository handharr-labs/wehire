// data/networking/TokenRefreshService.ts
import { type HTTPClient } from './HTTPClient';
import { NetworkError } from './NetworkError';
import { type TokenRefresher, type TokenStorage } from './TokenProvider';

interface TokenRefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export class TokenRefreshService implements TokenRefresher {
  private refreshPromise: Promise<void> | null = null;

  constructor(
    private readonly httpClient: HTTPClient, // unauthenticated client
    private readonly tokenStorage: TokenStorage
  ) {}

  async refreshToken(): Promise<void> {
    // Serialize concurrent refresh calls — all callers await the same promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.doRefresh().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async doRefresh(): Promise<void> {
    if (!this.isTokenExpired()) return;

    const refreshToken = this.tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new NetworkError('httpError', 'No refresh token available', 401);
    }

    const response = await this.httpClient.post<TokenRefreshResponse>(
      '/auth/refresh',
      { refresh_token: refreshToken }
    );

    this.tokenStorage.saveAccessToken(response.access_token);
    this.tokenStorage.saveRefreshToken(response.refresh_token);
  }

  private isTokenExpired(): boolean {
    const expiration = this.tokenStorage.getTokenExpiration();
    if (!expiration) return true;
    const bufferMs = 30_000; // 30 seconds buffer
    return Date.now() >= expiration.getTime() - bufferMs;
  }
}
