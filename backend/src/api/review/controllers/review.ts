import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::review.review' as any, ({ strapi }) => ({
  async find(ctx: Context) {
    try {
      const { artisan } = ctx.query;

      // Build filters
      const filters: Record<string, unknown> = {};

      // Filter by artisan if provided
      if (artisan) {
        const artisanId = typeof artisan === 'string' ? parseInt(artisan, 10) : artisan;
        if (!isNaN(artisanId as number)) {
          filters.artisan = {
            id: artisanId,
          };
        }
      }

      // Query reviews
      const reviews = await strapi.entityService.findMany('api::review.review' as any, {
        filters,
        populate: {
          artisan: {
            fields: ['id', 'full_name', 'slug'],
          },
          work_photos: {
            fields: ['id', 'url', 'alternativeText'],
          },
          submitted_by_user: {
            fields: ['id', 'username', 'email'],
          },
        },
        sort: { submitted_at: 'desc' },
      });

      // Calculate aggregate statistics if filtering by artisan
      let aggregateStats = null;
      if (artisan && reviews.length > 0) {
        const totalReviews = reviews.length;
        const totalScore = reviews.reduce((sum, review) => sum + (review.final_score || 0), 0);
        const averageScore = totalScore / totalReviews;

        // Calculate average for each criterion
        const criteriaAverages: Record<string, number> = {};
        reviews.forEach((review: any) => {
          if (review.rating_criteria && typeof review.rating_criteria === 'object') {
            Object.keys(review.rating_criteria).forEach((criterionId) => {
              if (!criteriaAverages[criterionId]) {
                criteriaAverages[criterionId] = 0;
              }
              criteriaAverages[criterionId] += review.rating_criteria[criterionId];
            });
          }
        });

        Object.keys(criteriaAverages).forEach((criterionId) => {
          criteriaAverages[criterionId] = Math.round((criteriaAverages[criterionId] / totalReviews) * 10) / 10;
        });

        aggregateStats = {
          totalReviews,
          averageScore: Math.round(averageScore * 10) / 10,
          criteriaAverages,
        };
      }

      // Transform to match frontend format
      const data = reviews.map((review: any) => ({
        id: review.id,
        artisan: review.artisan
          ? {
              id: review.artisan.id,
              fullName: review.artisan.full_name,
              slug: review.artisan.slug,
            }
          : null,
        ratingCriteria: review.rating_criteria,
        finalScore: review.final_score,
        comment: review.comment,
        workPhotos: review.work_photos?.map((photo: any) => ({
          id: photo.id,
          url: photo.url,
          alternativeText: photo.alternativeText,
        })) || [],
        submittedByUser: review.submitted_by_user
          ? {
              id: review.submitted_by_user.id,
              username: review.submitted_by_user.username,
              email: review.submitted_by_user.email,
            }
          : null,
        submittedAt: review.submitted_at,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      }));

      ctx.body = {
        data,
        meta: aggregateStats ? { aggregate: aggregateStats } : undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      strapi.log.error('Review find error', {
        message: errorMessage,
        error,
      });
      ctx.throw(500, `Failed to fetch reviews: ${errorMessage}`);
    }
  },

  async create(ctx: Context) {
    try {
      const { data } = ctx.request.body as { data: any };
      const { user } = ctx.state;

      if (!user) {
        ctx.throw(401, 'Authentication required');
      }

      // Validate required fields
      if (!data.artisan) {
        ctx.throw(400, 'Artisan ID is required');
      }

      if (!data.rating_criteria || typeof data.rating_criteria !== 'object') {
        ctx.throw(400, 'Rating criteria is required');
      }

      if (data.final_score === undefined || data.final_score === null) {
        ctx.throw(400, 'Final score is required');
      }

      // Validate work_photos (max 5)
      if (data.work_photos && Array.isArray(data.work_photos) && data.work_photos.length > 5) {
        ctx.throw(400, 'Maximum 5 work photos allowed');
      }

      // Verify artisan exists
      const artisan = await strapi.entityService.findOne('api::artisan.artisan' as any, data.artisan);
      if (!artisan) {
        ctx.throw(404, 'Artisan not found');
      }

      // Prepare review data
      const reviewData: any = {
        artisan: data.artisan,
        rating_criteria: data.rating_criteria,
        final_score: data.final_score,
        comment: data.comment || null,
        work_photos: data.work_photos || [],
        submitted_by_user: user.id,
        submitted_at: new Date().toISOString(),
        createdBy: null, // Prevent Strapi from auto-setting with users-permissions user
      };

      // Temporarily remove user from context to prevent Strapi from auto-setting createdBy
      const originalUser = ctx.state.user;
      ctx.state.user = undefined;

      try {
        // Create review
        const review = await strapi.entityService.create('api::review.review' as any, {
          data: reviewData,
          populate: ['artisan', 'work_photos', 'submitted_by_user'],
        });

        // Restore user in context
        ctx.state.user = originalUser;

        // Transform to match frontend format
        ctx.body = {
          data: {
            id: review.id,
            artisan: review.artisan
              ? {
                  id: review.artisan.id,
                  fullName: review.artisan.full_name,
                  slug: review.artisan.slug,
                }
              : null,
            ratingCriteria: review.rating_criteria,
            finalScore: review.final_score,
            comment: review.comment,
            workPhotos: review.work_photos?.map((photo: any) => ({
              id: photo.id,
              url: photo.url,
              alternativeText: photo.alternativeText,
            })) || [],
            submittedByUser: review.submitted_by_user
              ? {
                  id: review.submitted_by_user.id,
                  username: review.submitted_by_user.username,
                  email: review.submitted_by_user.email,
                }
              : null,
            submittedAt: review.submitted_at,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
          },
        };
      } catch (error) {
        // Restore user in context even on error
        ctx.state.user = originalUser;
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      strapi.log.error('Review create error', {
        message: errorMessage,
        error,
      });
      ctx.throw(500, `Failed to create review: ${errorMessage}`);
    }
  },
}));
