const locationRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/locations/search',
      handler: 'api::location.location.search',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
} as const;

export default locationRoutes;

