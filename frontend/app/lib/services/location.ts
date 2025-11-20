import { createQuery } from 'react-query-kit';
import { api } from '../api-client';
import { routes } from '../routes';

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

// Query key structure following the pattern
export const locationKeys = {
  all: ['locations'] as const,
  searches: () => [...locationKeys.all, 'search'] as const,
  search: (params: LocationSearchParams) => [...locationKeys.searches(), params] as const,
};

/**
 * Hook to search locations using OpenStreetMap/Nominatim
 * Returns locations matching the search query
 */
export const useSearchLocations = createQuery({
  queryKey: locationKeys.searches(),
  fetcher: async (variables: LocationSearchParams): Promise<LocationSearchResult[]> => {
    // Return empty array if query is empty
    if (!variables.query?.trim()) {
      return [];
    }

    // Build query parameters
    const params: Record<string, string | number> = {
      q: variables.query,
    };

    if (variables.countryCodes) {
      params.countrycodes = variables.countryCodes;
    }

    if (variables.limit && variables.limit > 0) {
      params.limit = variables.limit;
    }

    const response = await api.get<LocationSearchResponse>(routes.locations.search, {
      params,
    });

    return response.data;
  },
});
