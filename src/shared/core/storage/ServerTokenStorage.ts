import 'server-only';

import { type TokenStorage } from '@/data/networking/TokenProvider';

// Server-side in-memory token store.
// Module-level variables are singletons within a Node.js server process.
// For stateless/edge deployments, read tokens from HTTP-only cookies or env vars.
export class ServerTokenStorage implements TokenStorage {
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;
  private _tokenExpiration: Date | null = null;

  getAccessToken(): string | null {
    return this._accessToken;
  }

  getRefreshToken(): string | null {
    return this._refreshToken;
  }

  saveAccessToken(token: string): void {
    this._accessToken = token;
  }

  saveRefreshToken(token: string): void {
    this._refreshToken = token;
  }

  getTokenExpiration(): Date | null {
    return this._tokenExpiration;
  }
}
