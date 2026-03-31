import axios, { type AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { type HTTPClient } from './HTTPClient';

export function createUnauthenticatedHTTPClient(baseURL: string): HTTPClient {
  const instance: AxiosInstance = axios.create({ baseURL });

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

