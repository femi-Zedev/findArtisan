import { createQuery, createMutation } from 'react-query-kit';
import { useQuery } from '@tanstack/react-query';
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
  zone?: string | string[]; // Support single or multiple zones
  q?: string;
  page?: number;
  limit?: number;
  submittedBy?: string; // Filter by user ID who submitted
  isCommunitySubmitted?: boolean; // Filter by community submissions
  status?: string; // Filter by status (approved, pending, etc.)
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
export function useGetArtisans(variables: ArtisanSearchParams) {
  return useQuery({
    queryKey: artisanKeys.search(variables),
    queryFn: async (): Promise<ArtisanSearchResponse> => {
      // Build query params manually to handle multiple zones
      const params = new URLSearchParams();
      
      if (variables.profession) params.set('profession', variables.profession);
      if (variables.q) params.set('q', variables.q);
      if (variables.page) params.set('page', String(variables.page));
      if (variables.limit) params.set('pageSize', String(variables.limit));
      if (variables.submittedBy) params.set('submittedBy', variables.submittedBy);
      if (variables.isCommunitySubmitted !== undefined) params.set('isCommunitySubmitted', String(variables.isCommunitySubmitted));
      if (variables.status) params.set('status', variables.status);
      
      // Handle multiple zones - append each zone as a separate param
      if (variables.zone) {
        const zones = Array.isArray(variables.zone) ? variables.zone : [variables.zone];
        zones.forEach(z => {
          if (z) params.append('zone', z);
        });
      }

      const queryString = params.toString();
      const url = queryString
        ? `${routes.artisans.base}?${queryString}`
        : routes.artisans.base;

      const response = await api.get<ArtisanSearchResponse>(url);
      return response;
    },
    // Keep previous data while fetching new page to prevent flickering
    placeholderData: (previousData) => previousData,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

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
  profile_photo?: File | number; // File for new uploads, number (ID) for existing photos
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
  mutationFn: async ({
    payload,
    jwt,
  }: {
    payload: CreateArtisanPayload;
    jwt?: string;
  }): Promise<CreateArtisanResponse> => {
    let profilePhotoId: number | undefined;

    // Upload photo first if provided (only if it's a File)
    if (payload.profile_photo && payload.profile_photo instanceof File) {
      const uploadResponse = await api.uploadFile<Array<{ id: number }>>(
        routes.upload.base,
        payload.profile_photo,
        jwt
          ? {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          : undefined
      );
      profilePhotoId = uploadResponse[0]?.id;
    } else if (typeof payload.profile_photo === 'number') {
      // If it's already an ID, use it directly
      profilePhotoId = payload.profile_photo;
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

    const response = await api.post<CreateArtisanResponse>(
      routes.artisans.base,
      artisanData,
      jwt
        ? {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        : undefined
    );
    return response;
  },
});

// Types for batch creation
export interface CreateBatchArtisanPayload {
  full_name: string;
  description?: string;
  profession?: string;
  zones?: string[];
  phone_numbers?: Array<{
    number: string;
    is_whatsapp: boolean;
  }>;
  social_links?: Array<{
    platform: string;
    link: string;
  }>;
  is_community_submitted?: boolean;
  status?: string;
}

export interface BatchCreateResult {
  index: number;
  success: boolean;
  artisan?: Artisan;
  errors?: string[];
  errorMessage?: string;
}

export interface BatchCreateArtisanResponse {
  success: boolean;
  total: number;
  created: number;
  failed: number;
  results: BatchCreateResult[];
}

/**
 * Hook to create multiple artisans in batch (via CSV/Excel upload)
 */
export const useCreateBatchArtisans = createMutation({
  mutationKey: ['artisans', 'create-batch'],
  mutationFn: async ({
    payload,
    jwt,
  }: {
    payload: CreateBatchArtisanPayload[];
    jwt?: string;
  }): Promise<BatchCreateArtisanResponse> => {
    const response = await api.post<BatchCreateArtisanResponse>(
      `${routes.artisans.base}/batch`,
      { data: payload },
      jwt
        ? {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        : undefined
    );
    return response;
  },
});

/**
 * Hook to update an existing artisan
 */
export const useUpdateArtisan = createMutation({
  mutationKey: ['artisans', 'update'],
  mutationFn: async ({
    id,
    payload,
    jwt,
  }: {
    id: number;
    payload: CreateArtisanPayload;
    jwt: string;
  }): Promise<CreateArtisanResponse> => {
    let profilePhotoId: number | undefined;

    // Upload photo first if provided (and it's a File, not an ID)
    if (payload.profile_photo && payload.profile_photo instanceof File) {
      const uploadResponse = await api.uploadFile<Array<{ id: number }>>(
        routes.upload.base,
        payload.profile_photo,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      profilePhotoId = uploadResponse[0]?.id;
    } else if (typeof payload.profile_photo === 'number') {
      // If it's already an ID, use it directly
      profilePhotoId = payload.profile_photo;
    }

    // Prepare the artisan data
    const artisanData = {
      data: {
        full_name: payload.full_name,
        description: payload.description,
        profession: payload.profession,
        zones: payload.zones,
        phone_numbers: payload.phone_numbers?.map((phone) => ({
          number: phone.number,
          is_whatsapp: phone.is_whatsapp,
        })),
        social_links: payload.social_links?.map((social) => ({
          platform: social.platform,
          link: social.link,
        })),
        profile_photo: profilePhotoId,
        is_community_submitted: payload.is_community_submitted,
        status: payload.status,
      },
    };

    const response = await api.put<CreateArtisanResponse>(
      `${routes.artisans.base}/${id}`,
      artisanData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  },
});

/**
 * Hook to delete an artisan
 */
export const useDeleteArtisan = createMutation({
  mutationKey: ['artisans', 'delete'],
  mutationFn: async ({
    id,
    jwt,
  }: {
    id: number;
    jwt: string;
  }): Promise<{ data: { id: number } }> => {
    const response = await api.delete<{ data: { id: number } }>(
      `${routes.artisans.base}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  },
});

