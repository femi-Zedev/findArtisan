/**
 * Frontend Navigation Routes
 * Centralized route definitions for easy maintenance
 * 
 * Usage:
 * import { navRoutes } from '@/app/lib/navigation-routes';
 * <Link href={navRoutes.home}>Home</Link>
 * router.push(navRoutes.dashboard.artisans);
 * <Link href={navRoutes.profile(artisanSlug)}>Profile</Link>
 */

export const navRoutes = {
  // Public routes
  home: '/',
  search: '/search',
  
  // Anchor links (for same-page navigation)
  anchors: {
    faq: '/#faq',
    contact: '/#contact',
  },
  
  // Dashboard routes
  dashboard: {
    base: '/dashboard',
    artisans: '/dashboard/artisans',
    submissions: '/dashboard/submissions',
    contributions: '/dashboard/contributions',
  },
  
  // Dynamic routes (functions that return route strings)
  profile: (slug: string) => `/profile/${slug}`,
  
  // Helper function to build dashboard routes
  dashboardRoute: (path: string) => `/dashboard/${path}`,
} as const;

// Type exports for TypeScript autocomplete
export type NavRoute = typeof navRoutes;
export type DashboardRoute = typeof navRoutes.dashboard;
