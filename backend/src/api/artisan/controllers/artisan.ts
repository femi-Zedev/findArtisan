import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

interface ArtisanQuery {
  profession?: string | string[];
  zone?: string | string[];
  q?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
}

const parseSingleParam = (value: string | string[] | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value.at(0) : value;
};

const parseNumberParam = (value: string | string[] | undefined, defaultValue: number): number => {
  const param = parseSingleParam(value);
  if (!param) {
    return defaultValue;
  }
  const parsed = Number.parseInt(param, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? defaultValue : parsed;
};

export default factories.createCoreController('api::artisan.artisan' as any, ({ strapi }) => ({
  async find(ctx: Context) {
    const { profession, zone, q, page, pageSize } = ctx.query as ArtisanQuery;

    try {
      const professionFilter = parseSingleParam(profession);
      const zoneFilter = parseSingleParam(zone);
      const searchQuery = parseSingleParam(q);
      const pageParam = parseNumberParam(page, 1);
      const pageSizeParam = parseNumberParam(pageSize, 20);

      // Build filters
      const filters: Record<string, unknown> = {
        status: 'approved', // Only return approved artisans
      };

      // Filter by profession (if provided)
      if (professionFilter) {
        filters.profession = {
          name: {
            $containsi: professionFilter,
          },
        };
      }

      // Filter by zone (if provided)
      if (zoneFilter) {
        filters.zones = {
          name: {
            $containsi: zoneFilter,
          },
        };
      }

      // Search in name or description (if query provided)
      if (searchQuery) {
        filters.$or = [
          {
            full_name: {
              $containsi: searchQuery,
            },
          },
          {
            description: {
              $containsi: searchQuery,
            },
          },
        ];
      }

      // Query artisans with filters and populate relations
      const { results, pagination } = await strapi.entityService.findPage('api::artisan.artisan' as any, {
        filters,
        populate: {
          profession: {
            fields: ['id', 'name', 'slug'],
          },
          zones: {
            fields: ['id', 'name', 'slug', 'city'],
          },
          phone_numbers: {
            fields: ['id', 'number', 'is_whatsapp'],
          },
          social_links: {
            fields: ['id', 'platform', 'link'],
          },
          profile_photo: {
            fields: ['id', 'url', 'alternativeText'],
          },
        },
        fields: [
          'id',
          'full_name',
          'slug',
          'description',
          'status',
          'is_community_submitted',
          'createdAt',
          'updatedAt',
        ],
        sort: { createdAt: 'desc' },
        pagination: {
          page: pageParam,
          pageSize: pageSizeParam,
        },
      });

      // Transform results to include populated data
      const data = results.map((artisan: any) => ({
        id: artisan.id,
        fullName: artisan.full_name,
        slug: artisan.slug,
        description: artisan.description,
        status: artisan.status,
        isCommunitySubmitted: artisan.is_community_submitted,
        profession: artisan.profession
          ? {
            id: artisan.profession.id,
            name: artisan.profession.name,
            slug: artisan.profession.slug,
          }
          : null,
        zones: artisan.zones?.map((zone: any) => ({
          id: zone.id,
          name: zone.name,
          slug: zone.slug,
          city: zone.city,
        })) || [],
        phoneNumbers: artisan.phone_numbers?.map((phone: any) => ({
          id: phone.id,
          number: phone.number,
          isWhatsApp: phone.is_whatsapp,
        })) || [],
        socialLinks: artisan.social_links?.map((social: any) => ({
          id: social.id,
          platform: social.platform,
          link: social.link,
        })) || [],
        profilePhoto: artisan.profile_photo
          ? {
            id: artisan.profile_photo.id,
            url: artisan.profile_photo.url,
            alternativeText: artisan.profile_photo.alternativeText,
          }
          : null,
        createdAt: artisan.createdAt,
        updatedAt: artisan.updatedAt,
      }));

      ctx.body = {
        data,
        meta: {
          pagination: {
            page: pagination.page,
            pageSize: pagination.pageSize,
            pageCount: pagination.pageCount,
            total: pagination.total,
          },
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      strapi.log.error('Artisan find error', {
        message: errorMessage,
        stack: errorStack,
        error,
      });

      ctx.throw(500, `Failed to fetch artisans: ${errorMessage}`);
    }
  },
}));

