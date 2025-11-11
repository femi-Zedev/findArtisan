export interface LocationSearchParams {
  query: string;
  countryCodes?: string;
  limit?: number;
}

export interface LocationSearchResult {
  placeId: number;
  displayName: string;
  latitude: number;
  longitude: number;
  type: string;
  address?: Record<string, unknown>;
}

interface LocationSearchResponse {
  data: LocationSearchResult[];
  meta: {
    count: number;
  };
}

const DEFAULT_API_BASE_URL = 'http://localhost:1337/api';

const resolveApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

export async function searchLocations(
  params: LocationSearchParams,
  init?: RequestInit,
): Promise<LocationSearchResult[]> {
  const { query, countryCodes, limit } = params;

  if (!query.trim()) {
    return [];
  }

  const baseUrl = resolveApiBaseUrl();
  const endpoint = new URL(`${baseUrl}/locations/search`);

  endpoint.searchParams.set('q', query);

  if (countryCodes) {
    endpoint.searchParams.set('countrycodes', countryCodes);
  }

  if (typeof limit === 'number' && Number.isFinite(limit) && limit > 0) {
    endpoint.searchParams.set('limit', `${Math.floor(limit)}`);
  }

  const response = await fetch(endpoint.toString(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }

  const payload = (await response.json()) as LocationSearchResponse;

  return payload.data;
}

