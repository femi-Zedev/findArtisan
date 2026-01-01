import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::review.review' as any, ({ strapi }) => ({
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
          populate: ['artisan', 'work_photos'],
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
