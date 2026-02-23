/**
 * Shared pagination result for list APIs.
 * OpenAPI-friendly: generic schema for list responses.
 */
export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function createPaginationResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PaginationResult<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}
