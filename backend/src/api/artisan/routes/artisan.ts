const artisanRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/artisans',
      handler: 'api::artisan.artisan.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/artisans/stats',
      handler: 'api::artisan.artisan.stats',
      config: {
        auth: { scope: [] }, // Requires authentication
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/artisans/:id',
      handler: 'api::artisan.artisan.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/artisans',
      handler: 'api::artisan.artisan.create',
      config: {
        // Require authentication to create a single artisan
        auth: { scope: [] },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/artisans/batch',
      handler: 'api::artisan.artisan.createBatch',
      config: {
        // Require authentication to create artisans in batch
        auth: { scope: [] },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/artisans/:id',
      handler: 'api::artisan.artisan.update',
      config: {
        // Require authentication to update an artisan
        auth: { scope: [] },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/artisans/:id',
      handler: 'api::artisan.artisan.delete',
      config: {
        // Require authentication to delete an artisan
        auth: { scope: [] },
        policies: [],
        middlewares: [],
      },
    },
  ],
} as const;

export default artisanRoutes;
