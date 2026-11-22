export interface Page<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageCount: number;
  readonly total: number;
}

export const MAX_PAGE = 1000;

/** Reads a `?page=` value. Returns null for anything that is not a whole number from 1 to MAX_PAGE. */
export function parsePageNumber(raw: string | string[] | undefined): number | null {
  if (raw === undefined) return 1;
  if (Array.isArray(raw) || !/^[1-9]\d*$/.test(raw)) return null;
  const page = Number(raw);
  return page <= MAX_PAGE ? page : null;
}

export function pageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
