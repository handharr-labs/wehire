// data/networking/HTTPClient.ts
export interface RequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface HTTPClient {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T>;
  put<T>(path: string, body: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
}
