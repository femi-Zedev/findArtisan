import { createQuery } from 'react-query-kit';
import { api } from '../api-client';
import { routes } from '../routes';
import { paramsBuilder } from '../params-builder';

export interface LocationSearchParams {
  query?: string; // Optional - if not provided, fetches all cities
  countryCodes?: string;
  pageSize?: number;
}

export interface LocationSearchResult {
  city: string;
  country: string;
  pop2025: number;
  latitude: number;
  longitude: number;
  isValidCity: boolean;
  slug: string | null;
}

interface LocationSearchResponse {
  data: LocationSearchResult[];
  meta: {
    count: number;
  };
}

// Query key structure following the pattern
export const locationKeys = {
  all: ['locations'] as const,
  searches: () => [...locationKeys.all, 'search'] as const,
  search: (params: LocationSearchParams) => [...locationKeys.searches(), params] as const,
};

/**
 * Hook to search locations from static Benin cities list
 * Returns locations matching the search query
 */
export const useSearchLocations = createQuery({
  queryKey: locationKeys.searches(),
  fetcher: async (variables: LocationSearchParams): Promise<LocationSearchResult[]> => {
    // Build query parameters using paramsBuilder
    const queryString = paramsBuilder({
      q: variables.query?.trim() || undefined,
      pageSize: variables.pageSize && variables.pageSize > 0 ? variables.pageSize : undefined,
    });

    const url = queryString
      ? `${routes.locations.base}?${queryString}`
      : routes.locations.base;

    const response = await api.get<LocationSearchResponse>(url);

    return response.data;
  },
  // React Query options - passed directly, not nested
  retry: false, // Disable retries for location searches to prevent multiple requests
  staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes (formerly cacheTime)
  refetchOnWindowFocus: false, // Don't refetch on window focus
  refetchOnMount: false, // Don't refetch on mount if data exists
});
