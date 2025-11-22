import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::artisan.artisan' as any, {
  config: {
    find: { auth: false },
    findOne: { auth: false },
    create: { auth: false }, // Allow public artisan submissions
  },
});

