"use client";

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { api } from '../api-client';
import { routes } from '../routes';

// Types
export interface AdminStats {
  totalArtisans: number;
  pendingSubmissions: number;
  thisMonth: number;
}

export interface UserStats {
  totalArtisans: number;
  myContributions: number;
  thisMonth: number;
}

export type DashboardStats = AdminStats | UserStats;

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  // Include userId in the key to avoid sharing cached stats between users
  stats: (userId: string | null | undefined) =>
    [...dashboardKeys.all, 'stats', userId ?? 'anonymous'] as const,
};

/**
 * Hook to fetch dashboard statistics
 * Returns different stats based on user role (admin vs user)
 * Automatically gets JWT from NextAuth session
 */
export function useGetDashboardStats() {
  const { data: session } = useSession();
  const jwt = (session?.user as any)?.strapiJwt || '';
  const userId = session?.user?.id;

  return useQuery({
    queryKey: dashboardKeys.stats(userId),
    queryFn: async (): Promise<DashboardStats> => {
      if (!jwt) {
        throw new Error('Authentication required');
      }

      const response = await api.get<DashboardStats>(`${routes.artisans.base}/stats`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response;
    },
    // Only run query if JWT and userId are available
    enabled: !!jwt && !!userId,
    retry: false,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

