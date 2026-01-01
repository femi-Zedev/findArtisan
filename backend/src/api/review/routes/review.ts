const reviewRoutes = {
  routes: [
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
