/**
 * API Routes
 * Centralized route definitions for easy maintenance
 */

export const routes = {
  locations: {
    base: '/locations',
  },
  artisans: {
    base: '/artisans',
  },
  communitySubmissions: {
    base: '/community-submissions',
  },
  upload: {
    base: '/upload',
  },
  reviews: {
    base: '/reviews',
  },
} as const;


