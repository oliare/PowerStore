export interface PagedResponse<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
