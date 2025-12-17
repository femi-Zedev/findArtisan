# Dashboard Stats Integration Plan

## Overview
Plan for integrating real-time statistics for both admin and user dashboards, replacing hardcoded "0" values with actual data from the backend.

## Stats Requirements

### Admin Stats
1. **Total Artisans** - Count of all approved artisans (`status = 'approved'`)
2. **Soumissions récentes** - Count of pending community submissions (`moderation_status = 'pending'`)
3. **Ce mois-ci** - Count of artisans created this month (all statuses)

### User Stats
1. **Total Artisans** - Count of all approved artisans (same as admin, for reference)
2. **Mes Contributions** - Count of artisans submitted by the current user (`submitted_by_email` matches user email)
3. **Ce mois-ci** - Count of user's contributions created this month

## Implementation Plan

### Phase 1: Backend API Endpoint

#### 1.1 Create Stats Controller
**File:** `backend/src/api/artisan/controllers/artisan.ts`

Add a new `stats` method:
```typescript
async stats(ctx: Context) {
  const { user } = ctx.state; // From NextAuth session
  
  // Get current month start date
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Total approved artisans
  const totalArtisans = await strapi.entityService.count('api::artisan.artisan', {
    filters: { status: 'approved' }
  });
  
  // Admin-specific stats
  if (user?.role?.type === 'admin') {
    // Pending submissions
    const pendingSubmissions = await strapi.entityService.count(
      'api::community-submission.community-submission',
      { filters: { moderation_status: 'pending' } }
    );
    
    // Artisans created this month
    const thisMonth = await strapi.entityService.count('api::artisan.artisan', {
      filters: {
        createdAt: { $gte: startOfMonth.toISOString() }
      }
    });
    
    return {
      totalArtisans,
      pendingSubmissions,
      thisMonth
    };
  }
  
  // User-specific stats
  const userEmail = user?.email;
  
  // User's contributions
  const myContributions = await strapi.entityService.count('api::artisan.artisan', {
    filters: {
      submitted_by_email: userEmail,
      status: 'approved' // Only count approved ones
    }
  });
  
  // User's contributions this month
  const thisMonth = await strapi.entityService.count('api::artisan.artisan', {
    filters: {
      submitted_by_email: userEmail,
      createdAt: { $gte: startOfMonth.toISOString() }
    }
  });
  
  return {
    totalArtisans,
    myContributions,
    thisMonth
  };
}
```

#### 1.2 Add Stats Route
**File:** `backend/src/api/artisan/routes/artisan.ts`

Add route:
```typescript
{
  method: 'GET',
  path: '/artisans/stats',
  handler: 'artisan.stats',
  config: {
    auth: true, // Require authentication
  },
}
```

### Phase 2: Frontend Service Layer

#### 2.1 Create Stats Service
**File:** `frontend/app/lib/services/dashboard.ts` (new file)

```typescript
import { createQuery } from 'react-query-kit';
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
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch dashboard statistics
 * Returns different stats based on user role (admin vs user)
 */
export const useGetDashboardStats = createQuery({
  queryKey: dashboardKeys.stats(),
  fetcher: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>(`${routes.artisans.base}/stats`);
    return response;
  },
  retry: false,
  staleTime: 1000 * 60 * 2, // Cache for 2 minutes
  gcTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
});
```

#### 2.2 Update Routes
**File:** `frontend/app/lib/routes.ts`

Routes are already defined, no changes needed.

### Phase 3: Update Dashboard Page

#### 3.1 Update Dashboard Component
**File:** `frontend/app/dashboard/page.tsx`

Changes:
1. Import the stats hook
2. Fetch stats based on user role
3. Map stats to the UI cards
4. Handle loading and error states
5. Format numbers with proper formatting (e.g., 1,234)

```typescript
import { useGetDashboardStats } from "@/app/lib/services/dashboard";
import { Skeleton } from "@mantine/core";

// In component:
const { data: stats, isLoading, error } = useGetDashboardStats();

// Build stats array based on role and fetched data
const statsCards = useMemo(() => {
  if (!stats) return [];
  
  if (isAdmin()) {
    const adminStats = stats as AdminStats;
    return [
      {
        label: "Total Artisans",
        value: adminStats.totalArtisans.toLocaleString(),
        icon: Users,
        color: "teal",
      },
      {
        label: "Soumissions récentes",
        value: adminStats.pendingSubmissions.toLocaleString(),
        icon: FileText,
        color: "yellow",
      },
      {
        label: "Ce mois-ci",
        value: adminStats.thisMonth.toLocaleString(),
        icon: TrendingUp,
        color: "blue",
      },
    ];
  } else {
    const userStats = stats as UserStats;
    return [
      {
        label: "Total Artisans",
        value: userStats.totalArtisans.toLocaleString(),
        icon: Users,
        color: "teal",
      },
      {
        label: "Mes Contributions",
        value: userStats.myContributions.toLocaleString(),
        icon: FileText,
        color: "yellow",
      },
      {
        label: "Ce mois-ci",
        value: userStats.thisMonth.toLocaleString(),
        icon: TrendingUp,
        color: "blue",
      },
    ];
  }
}, [stats, isAdmin]);
```

### Phase 4: Error Handling & Loading States

#### 4.1 Loading State
Show skeleton loaders while fetching:
```typescript
{isLoading ? (
  <Skeleton height={100} radius="md" />
) : (
  // Stats cards
)}
```

#### 4.2 Error State
Show error message if fetch fails:
```typescript
{error && (
  <Text c="red" size="sm">
    Erreur lors du chargement des statistiques
  </Text>
)}
```

## Data Flow

```
Dashboard Page
    ↓
useGetDashboardStats() hook
    ↓
API Client (with auth token)
    ↓
GET /api/artisans/stats
    ↓
Strapi Controller (checks user role)
    ↓
Entity Service Queries
    ↓
Returns stats based on role
    ↓
React Query caches & returns data
    ↓
Dashboard displays stats
```

## Security Considerations

1. **Authentication Required**: Stats endpoint must require authentication
2. **Role-Based Data**: Backend must filter data based on user role
3. **User Isolation**: Users can only see their own contributions
4. **Email Matching**: Use `submitted_by_email` to match user contributions

## Testing Checklist

- [ ] Admin sees correct admin stats
- [ ] User sees correct user stats
- [ ] Loading states display correctly
- [ ] Error states handle gracefully
- [ ] Stats update after mutations (invalidate queries)
- [ ] Numbers are formatted correctly (locale)
- [ ] Month calculation is correct (timezone aware)

## Future Enhancements

1. **Real-time Updates**: Use WebSockets or polling for live stats
2. **Date Range Filters**: Allow users to filter "This Month" to custom ranges
3. **Charts/Graphs**: Visualize stats over time
4. **Export Stats**: Allow admins to export statistics
5. **Caching Strategy**: Implement more sophisticated caching


