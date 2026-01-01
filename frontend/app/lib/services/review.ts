import { createMutation } from 'react-query-kit';
import { api } from '../api-client';
import { routes } from '../routes';

// Types
export interface Review {
  id: number;
  artisan: {
    id: number;
    fullName: string;
    slug: string;
  } | null;
  ratingCriteria: Record<string, number>; // e.g., { deadlines: 7, professionalism: 10, ... }
  finalScore: number;
  comment: string | null;
  workPhotos: Array<{
    id: number;
    url: string;
    alternativeText: string | null;
  }>;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  artisan: number; // Artisan ID
  rating_criteria: Record<string, number>; // Criterion ID -> points
  final_score: number; // Calculated in frontend
  comment?: string;
  work_photos?: number[]; // Array of uploaded photo IDs
}

export interface CreateReviewResponse {
  data: Review;
}

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
