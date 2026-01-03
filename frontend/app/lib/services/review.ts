import { createMutation, createQuery } from 'react-query-kit';
import { api } from '../api-client';
import { routes } from '../routes';
import { paramsBuilder } from '../params-builder';

// Types
export interface Review {
  id: number;
  artisan: {
    id: number;
    fullName: string;
    slug: string;
  } | null;
  ratingCriteria: Record<string, { points: number; label: string }>; // e.g., { deadlines: { points: 7, label: 'Léger retard' }, ... }
  finalScore: number;
  comment: string | null;
  workPhotos: Array<{
    id: number;
    url: string;
    alternativeText: string | null;
  }>;
  submittedByUser: {
    id: number;
    username: string;
    email: string;
  } | null;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  artisan: number; // Artisan ID
  rating_criteria: Record<string, { points: number; label: string }>; // Criterion ID -> { points, label }
  final_score: number; // Calculated in frontend
  comment?: string;
  work_photos?: number[]; // Array of uploaded photo IDs
}

export interface CreateReviewResponse {
  data: Review;
}

export interface GetReviewsParams {
  artisan?: number; // Filter by artisan ID
}

export interface GetReviewsResponse {
  data: Review[];
  meta?: {
    aggregate?: {
      totalReviews: number;
      averageScore: number;
      criteriaAverages: Record<string, number>;
    };
  };
}

/**
 * Hook to get reviews (optionally filtered by artisan)
 */
export const useGetReviews = createQuery({
  queryKey: ['reviews'],
  fetcher: async (params?: GetReviewsParams): Promise<GetReviewsResponse> => {
    const queryString = paramsBuilder(params || {});
    const url = queryString ? `${routes.reviews.base}?${queryString}` : routes.reviews.base;
    const response = await api.get<GetReviewsResponse>(url);
    return response;
  },
  retry: false,
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
});

/**
 * Hook to create a review for an artisan
 */
export const useCreateReview = createMutation({
  mutationKey: ['reviews', 'create'],
  mutationFn: async ({
    payload,
    jwt,
  }: {
    payload: CreateReviewPayload;
    jwt: string;
  }): Promise<CreateReviewResponse> => {
    const reviewData = {
      data: {
        artisan: payload.artisan,
        rating_criteria: payload.rating_criteria,
        final_score: payload.final_score,
        comment: payload.comment || null,
        work_photos: payload.work_photos || [],
      },
    };

    const response = await api.post<CreateReviewResponse>(
      routes.reviews.base,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  },
});
