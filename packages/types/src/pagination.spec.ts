import { createPaginationResult, PaginationResult } from './pagination';

describe('pagination (T001)', () => {
  it('createPaginationResult returns PaginationResult with totalPages', () => {
    const items = [1, 2, 3];
    const result: PaginationResult<number> = createPaginationResult(items, 10, 1, 3);
    expect(result.items).toEqual([1, 2, 3]);
    expect(result.total).toBe(10);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(3);
    expect(result.totalPages).toBe(4);
  });

  it('totalPages is 1 when total is 0', () => {
    const result = createPaginationResult([], 0, 1, 10);
    expect(result.totalPages).toBe(1);
  });
});
