// data/dtos/PaginatedDTO.ts
export interface PaginatedDTO<T> {
  items: T[];
  total_count: number;
  current_page: number;
  total_pages: number;
}
