import 'client-only';

import { type TokenStorage } from '@/data/networking/TokenProvider';

// Client-side localStorage implementation of TokenStorage.
// Guards typeof window for SSR safety.
export class LocalStorageTokenProvider implements TokenStorage {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  saveAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  }

  saveRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refreshToken', token);
  }

  getTokenExpiration(): Date | null {
    if (typeof window === 'undefined') return null;
    const exp = localStorage.getItem('tokenExpiration');
    return exp ? new Date(exp) : null;
  }
}
