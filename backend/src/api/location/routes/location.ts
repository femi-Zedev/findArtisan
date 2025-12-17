const locationRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/locations',
      handler: 'api::location.location.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
} as const;

export default locationRoutes;

