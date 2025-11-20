export function paramsBuilder<
  T = Record<string, string | number | undefined | null | (string | number)[]>,
>(params: T) {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach(v => {
        searchParams.append(key + '[]', String(v));
      });
    } else if (value) {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
}

export interface PaginatedRequest {
  limit?: number;
  page?: number;
  query?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: string;
}
