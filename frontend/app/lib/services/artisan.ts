import { createQuery, createMutation } from 'react-query-kit';
import { api } from '../api-client';
import { routes } from '../routes';
import { paramsBuilder } from '../params-builder';

// Types
export interface Artisan {
  id: number;
  fullName: string;
  slug: string;
  description: string;
  status: string;
  isCommunitySubmitted: boolean;
  profession: {
    id: number;
    name: string;
    slug: string;
  } | null;
  zones: Array<{
    id: number;
    name: string;
    slug: string;
    city: string | null;
  }>;
  phoneNumbers: Array<{
    id: number;
    number: string;
    isWhatsApp: boolean;
  }>;
  socialLinks: Array<{
    id: number;
    platform: string;
    link: string;
  }>;
  profilePhoto: {
    id: number;
    url: string;
    alternativeText: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArtisanSearchParams {
  profession?: string;
  zone?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface ArtisanSearchResponse {
  data: Artisan[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Query keys
export const artisanKeys = {
  all: ['artisans'] as const,
  searches: () => [...artisanKeys.all, 'search'] as const,
  search: (params: ArtisanSearchParams) => [...artisanKeys.searches(), params] as const,
  details: () => [...artisanKeys.all, 'detail'] as const,
  detail: (slug: string) => [...artisanKeys.details(), slug] as const,
  recentlyAdded: () => [...artisanKeys.all, 'recently-added'] as const,
};

/**
 * Hook to search/filter artisans
 */
export const useGetArtisans = createQuery({
  queryKey: artisanKeys.searches(),
  fetcher: async (variables: ArtisanSearchParams): Promise<ArtisanSearchResponse> => {
    const queryString = paramsBuilder({
      profession: variables.profession,
      zone: variables.zone,
      q: variables.q,
      page: variables.page,
      pageSize: variables.limit, // Backend uses pageSize, not limit
    });

    const url = queryString
      ? `${routes.artisans.base}?${queryString}`
      : routes.artisans.base;

    const response = await api.get<ArtisanSearchResponse>(url);
    return response;
  },
  retry: false,
  staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  gcTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

/**
 * Hook to get a single artisan by slug
 */
export const useGetArtisan = createQuery({
  queryKey: artisanKeys.details(),
  fetcher: async (slug: string): Promise<Artisan> => {
    const response = await api.get<{ data: Artisan }>(`${routes.artisans.base}/${slug}`);
    return response.data;
  },
  retry: false,
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
});

/**
 * Hook to get recently added artisans
 */
export const useGetRecentlyAdded = createQuery({
  queryKey: artisanKeys.recentlyAdded(),
  fetcher: async (limit: number = 6): Promise<ArtisanSearchResponse> => {
    const queryString = paramsBuilder({
      pageSize: limit, // Backend uses pageSize, not limit
      page: 1,
    });

    const url = `${routes.artisans.base}?${queryString}`;
    const response = await api.get<ArtisanSearchResponse>(url);
    return response;
  },
  retry: false,
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
});

