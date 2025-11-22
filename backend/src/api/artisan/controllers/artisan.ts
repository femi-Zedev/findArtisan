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
            fields: ['id', 'platform', 'url'],
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
          link: social.url, // Map 'url' from DB to 'link' for frontend
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

  async create(ctx: Context) {
    try {
      const { data } = ctx.request.body as { data: any };

      // Resolve profession from slug/name to ID
      let professionId: string | number | undefined;
      if (data.profession && data.profession.trim()) {
        const profession = await strapi.entityService.findMany('api::profession.profession' as any, {
          filters: {
            $or: [
              { slug: data.profession.trim().toLowerCase() },
              { name: { $containsi: data.profession.trim() } },
            ],
          },
          limit: 1,
        });
        if (profession && profession.length > 0) {
          professionId = profession[0].id;
        } else {
          // If profession doesn't exist, create it
          const professionName = data.profession.trim();
          const professionSlug = professionName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          
          const newProfession = await strapi.entityService.create('api::profession.profession' as any, {
            data: {
              name: professionName,
              slug: professionSlug,
            },
          });
          professionId = newProfession.id;
        }
      }

      // Resolve zones from slugs to IDs
      const zoneIds: (string | number)[] = [];
      if (data.zones && Array.isArray(data.zones) && data.zones.length > 0) {
        for (const zoneSlug of data.zones) {
          if (!zoneSlug || !zoneSlug.trim()) continue;
          
          const zone = await strapi.entityService.findMany('api::zone.zone' as any, {
            filters: {
              $or: [
                { slug: zoneSlug.trim().toLowerCase() },
                { name: { $containsi: zoneSlug.trim() } },
              ],
            },
            limit: 1,
          });
          if (zone && zone.length > 0) {
            zoneIds.push(zone[0].id);
          } else {
            // If zone doesn't exist, create it
            const zoneName = zoneSlug.trim();
            const zoneSlugNormalized = zoneName
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');
            
            try {
              const newZone = await strapi.entityService.create('api::zone.zone' as any, {
                data: {
                  name: zoneName,
                  slug: zoneSlugNormalized,
                },
              });
              zoneIds.push(newZone.id);
            } catch (zoneError: any) {
              strapi.log.warn('Zone creation failed (may be duplicate)', {
                name: zoneName,
                error: zoneError.message,
              });
            }
          }
        }
      }

      // Generate slug from full_name (Strapi UID field requires this)
      let baseSlug = data.full_name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

      // Ensure slug is unique
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await strapi.entityService.findMany('api::artisan.artisan' as any, {
          filters: { slug },
          limit: 1,
        });
        if (!existing || existing.length === 0) {
          break;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Prepare artisan data
      const artisanData: any = {
        full_name: data.full_name,
        slug: slug,
        description: data.description,
        is_community_submitted: data.is_community_submitted ?? true,
        status: data.status ?? 'approved',
      };

      if (professionId) {
        artisanData.profession = professionId;
      }

      if (data.profile_photo) {
        artisanData.profile_photo = data.profile_photo;
      }

      // Create artisan
      const artisan = await strapi.entityService.create('api::artisan.artisan' as any, {
        data: artisanData,
        populate: ['profession', 'zones'],
      });

      // Link zones
      if (zoneIds.length > 0) {
        await strapi.entityService.update('api::artisan.artisan' as any, artisan.id, {
          data: {
            zones: zoneIds,
          },
        });
      }

      // Create phone numbers
      if (data.phone_numbers && Array.isArray(data.phone_numbers) && data.phone_numbers.length > 0) {
        for (const phoneData of data.phone_numbers) {
          if (phoneData.number && phoneData.number.trim()) {
            try {
              await strapi.entityService.create('api::phone-number.phone-number' as any, {
                data: {
                  number: phoneData.number.trim(),
                  is_whatsapp: phoneData.is_whatsapp ?? false,
                  artisan: artisan.id,
                },
              });
            } catch (phoneError: any) {
              // Log but don't fail if phone number already exists (unique constraint)
              strapi.log.warn('Phone number creation failed (may be duplicate)', {
                number: phoneData.number,
                error: phoneError.message,
              });
            }
          }
        }
      }

      // Create social links
      if (data.social_links && Array.isArray(data.social_links) && data.social_links.length > 0) {
        for (const socialData of data.social_links) {
          if (socialData.platform && socialData.link && socialData.link.trim()) {
            // Ensure URL has protocol
            let url = socialData.link.trim();
            if (!url.match(/^https?:\/\//i)) {
              url = `https://${url}`;
            }

            // Validate platform is in enum
            const validPlatforms = ['facebook', 'instagram', 'tiktok', 'whatsapp', 'website', 'other'];
            const platform = validPlatforms.includes(socialData.platform.toLowerCase())
              ? socialData.platform.toLowerCase()
              : 'other';

            try {
              await strapi.entityService.create('api::social-link.social-link' as any, {
                data: {
                  platform: platform,
                  url: url, // Schema uses 'url', not 'link'
                  artisan: artisan.id,
                },
              });
            } catch (socialError: any) {
              strapi.log.warn('Social link creation failed', {
                platform: platform,
                url: url,
                error: socialError.message,
              });
            }
          }
        }
      }

      // Fetch complete artisan with all relations
      const completeArtisan = await strapi.entityService.findOne('api::artisan.artisan' as any, artisan.id, {
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
            fields: ['id', 'platform', 'url'],
          },
          profile_photo: {
            fields: ['id', 'url', 'alternativeText'],
          },
        },
      });

      // Transform to match frontend format
      ctx.body = {
        data: {
          id: completeArtisan.id,
          fullName: completeArtisan.full_name,
          slug: completeArtisan.slug,
          description: completeArtisan.description,
          status: completeArtisan.status,
          isCommunitySubmitted: completeArtisan.is_community_submitted,
          profession: completeArtisan.profession
            ? {
              id: completeArtisan.profession.id,
              name: completeArtisan.profession.name,
              slug: completeArtisan.profession.slug,
            }
            : null,
          zones: completeArtisan.zones?.map((zone: any) => ({
            id: zone.id,
            name: zone.name,
            slug: zone.slug,
            city: zone.city,
          })) || [],
          phoneNumbers: completeArtisan.phone_numbers?.map((phone: any) => ({
            id: phone.id,
            number: phone.number,
            isWhatsApp: phone.is_whatsapp,
          })) || [],
          socialLinks: completeArtisan.social_links?.map((social: any) => ({
            id: social.id,
            platform: social.platform,
            link: social.url, // Map 'url' from DB to 'link' for frontend
          })) || [],
          profilePhoto: completeArtisan.profile_photo
            ? {
              id: completeArtisan.profile_photo.id,
              url: completeArtisan.profile_photo.url,
              alternativeText: completeArtisan.profile_photo.alternativeText,
            }
            : null,
          createdAt: completeArtisan.createdAt,
          updatedAt: completeArtisan.updatedAt,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      strapi.log.error('Artisan create error', {
        message: errorMessage,
        error,
      });
      ctx.throw(500, `Failed to create artisan: ${errorMessage}`);
    }
  },
}));

