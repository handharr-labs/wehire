// data/networking/NetworkError.ts
export type NetworkErrorType =
  | 'httpError'
  | 'noConnection'
  | 'timeout'
  | 'parseError'
  | 'unknown';

export class NetworkError extends Error {
  readonly type: NetworkErrorType;
  readonly statusCode?: number;

  constructor(type: NetworkErrorType, message?: string, statusCode?: number) {
    super(message ?? type);
    this.name = 'NetworkError';
    this.type = type;
    this.statusCode = statusCode;
  }
}
