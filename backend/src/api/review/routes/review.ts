const reviewRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/reviews',
      handler: 'api::review.review.find',
      config: {
        auth: false, // Public access
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/reviews',
      handler: 'api::review.review.create',
      config: {
        auth: { scope: [] }, // Requires authentication
        policies: [],
        middlewares: [],
      },
    },
  ],
} as const;

export default reviewRoutes;
