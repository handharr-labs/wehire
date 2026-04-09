import axios, { type AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { type HTTPClient, type RequestOptions } from './HTTPClient';

export class AxiosHTTPClient implements HTTPClient {
  private readonly instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL });

    axiosRetry(this.instance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => axiosRetry.isNetworkError(error),
    });
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.instance.get(path, { params: options?.params }).then((r) => r.data);
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.instance.post(path, body).then((r) => r.data);
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.instance.put(path, body).then((r) => r.data);
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.instance.patch(path, body).then((r) => r.data);
  }

  delete<T>(path: string): Promise<T> {
    return this.instance.delete(path).then((r) => r.data);
  }
}
