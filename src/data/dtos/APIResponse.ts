// data/dtos/APIResponse.ts
export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
