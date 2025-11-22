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

// Types for creating artisan
export interface CreateArtisanPayload {
  full_name: string;
  description: string;
  profession?: string; // Profession slug or name
  zones?: string[]; // Zone slugs
  phone_numbers?: Array<{
    number: string;
    is_whatsapp: boolean;
  }>;
  social_links?: Array<{
    platform: string;
    link: string;
  }>;
  profile_photo?: File;
  is_community_submitted?: boolean;
  status?: string;
}

export interface CreateArtisanResponse {
  data: Artisan;
}

/**
 * Hook to create a new artisan (via community submission)
 * Handles file upload and artisan creation
 */
export const useCreateArtisan = createMutation({
  mutationKey: ['artisans', 'create'],
  mutationFn: async (payload: CreateArtisanPayload): Promise<CreateArtisanResponse> => {
    let profilePhotoId: number | undefined;

    // Upload photo first if provided
    if (payload.profile_photo) {
      const uploadResponse = await api.uploadFile<Array<{ id: number }>>(
        routes.upload.base,
        payload.profile_photo
      );
      profilePhotoId = uploadResponse[0]?.id;
    }

    // Prepare the artisan data
    const artisanData = {
      data: {
        full_name: payload.full_name,
        description: payload.description,
        profession: payload.profession, // Backend will need to resolve this to ID
        zones: payload.zones, // Backend will need to resolve these to IDs
        phone_numbers: payload.phone_numbers?.map((phone) => ({
          number: phone.number,
          is_whatsapp: phone.is_whatsapp,
        })),
        social_links: payload.social_links?.map((social) => ({
          platform: social.platform,
          link: social.link,
        })),
        profile_photo: profilePhotoId,
        is_community_submitted: payload.is_community_submitted ?? true,
        status: payload.status ?? 'approved',
      },
    };

    const response = await api.post<CreateArtisanResponse>(routes.artisans.base, artisanData);
    return response;
  },
});

