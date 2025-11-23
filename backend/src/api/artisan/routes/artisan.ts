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
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/artisans/batch',
      handler: 'api::artisan.artisan.createBatch',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
} as const;

export default artisanRoutes;

