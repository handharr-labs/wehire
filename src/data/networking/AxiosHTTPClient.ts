// data/networking/AxiosHTTPClient.ts
import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import axiosRetry from 'axios-retry';
import { type HTTPClient } from './HTTPClient';
import { NetworkError } from './NetworkError';
import { type TokenProvider, type TokenRefresher } from './TokenProvider';

export function createHTTPClient(
  baseURL: string,
  tokenProvider: TokenProvider,
  tokenRefresher: TokenRefresher
): HTTPClient {
  const instance: AxiosInstance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  // --- Auth: attach Bearer token to every request ---
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenProvider.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }
  );

  // --- Auth: refresh token on 401 and retry once ---
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

      if (error.response?.status === 401 && !config._retried) {
        config._retried = true;
        await tokenRefresher.refreshToken();
        return instance.request(config);
      }

      throw mapAxiosError(error);
    }
  );

  // --- Retry: exponential backoff for network errors and 5xx ---
  axiosRetry(instance, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) =>
      axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error),
    onRetry: (retryCount, error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Retry attempt ${retryCount} for ${error.config?.url}`);
      }
    },
  });

  // --- Development logger ---
  if (process.env.NODE_ENV === 'development') {
    instance.interceptors.request.use((config) => {
      console.log(`-> ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });
    instance.interceptors.response.use((response) => {
      console.log(`<- ${response.status} ${response.config.url}`);
      return response;
    });
  }

  return {
    get: (path, options) =>
      instance.get(path, { params: options?.params, headers: options?.headers, signal: options?.signal })
        .then((r) => r.data),
    post: (path, body, options) =>
      instance.post(path, body, { headers: options?.headers, signal: options?.signal })
        .then((r) => r.data),
    put: (path, body, options) =>
      instance.put(path, body, { headers: options?.headers, signal: options?.signal })
        .then((r) => r.data),
    patch: (path, body, options) =>
      instance.patch(path, body, { headers: options?.headers, signal: options?.signal })
        .then((r) => r.data),
    delete: (path, options) =>
      instance.delete(path, { headers: options?.headers, signal: options?.signal })
        .then((r) => r.data),
  };
}

export function createUnauthenticatedHTTPClient(baseURL: string): HTTPClient {
  const instance: AxiosInstance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  axiosRetry(instance, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => axiosRetry.isNetworkError(error),
  });

  return {
    get: (path, options) => instance.get(path, { params: options?.params }).then((r) => r.data),
    post: (path, body) => instance.post(path, body).then((r) => r.data),
    put: (path, body) => instance.put(path, body).then((r) => r.data),
    patch: (path, body) => instance.patch(path, body).then((r) => r.data),
    delete: (path) => instance.delete(path).then((r) => r.data),
  };
}

function mapAxiosError(error: AxiosError): NetworkError {
  if (error.response) {
    return new NetworkError(
      'httpError',
      `HTTP ${error.response.status}`,
      error.response.status
    );
  }
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
    return new NetworkError('timeout', error.message);
  }
  if (error.code === 'ERR_NETWORK') {
    return new NetworkError('noConnection', error.message);
  }
  return new NetworkError('unknown', error.message);
}
