# NextAuth Google Authentication Implementation

## Overview
This document outlines the implementation of Google authentication using NextAuth.js v5 with Strapi backend integration.

## Implementation Status

### ✅ Completed

1. **NextAuth Setup**
   - Installed `next-auth@5.0.0-beta.30`
   - Created NextAuth route handler at `app/api/auth/[...nextauth]/route.ts`
   - Configured Google Provider
   - Set up JWT session strategy
   - Added TypeScript type definitions

2. **Strapi Integration**
   - Created custom endpoint extension at `backend/src/extensions/users-permissions/strapi-server.ts`
   - Endpoint: `POST /api/auth/google/callback`
   - Handles user registration/login
   - First user automatically becomes `admin`
   - Subsequent users become `user`

3. **Frontend Integration**
   - Created `useAuth` hook to sync NextAuth session with Zustand store
   - Updated `GoogleLoginModal` to use NextAuth `signIn()`
   - Updated `DashboardAuthGuard` to use NextAuth session
   - Added `SessionProvider` to app layout
   - Created logout utility function

4. **Services & Utilities**
   - Created auth service at `app/lib/services/auth.ts`
   - Created logout utility at `app/lib/utils/auth.ts`

## Required Setup

### 1. Environment Variables

Add the following to your `.env.local` file in the `frontend` directory:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Strapi API (if not already set)
NEXT_PUBLIC_API_URL=http://localhost:1337/api
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

### 3. Strapi Roles Setup

**IMPORTANT:** You must create `admin` and `user` roles in Strapi before authentication will work.

1. Go to Strapi Admin Panel: `http://localhost:1337/admin`
2. Navigate to: **Settings** → **Users & Permissions Plugin** → **Roles**
3. Create two roles:
   - **Admin** (type: `admin`)
   - **User** (type: `user`)
4. Configure permissions for each role as needed

### 4. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output to your `.env.local` file.

## How It Works

### Authentication Flow

1. User clicks "Sign in with Google" button
2. NextAuth redirects to Google OAuth
3. User authorizes the application
4. Google redirects back to NextAuth callback
5. NextAuth `signIn` callback is triggered
6. Frontend calls Strapi endpoint `/api/auth/google/callback` with user info
7. Strapi checks if user exists:
   - If exists: Returns user with JWT
   - If new: Creates user, assigns role (first user = admin, others = user), returns JWT
8. NextAuth stores Strapi JWT in session
9. Session is synced to Zustand store via `useAuth` hook
10. User is authenticated and can access dashboard

### Role Assignment Logic

- **First user** to authenticate → `admin` role
- **All subsequent users** → `user` role

This is handled automatically in the Strapi endpoint.

### Logout Flow

1. User clicks logout
2. Zustand store is cleared
3. NextAuth `signOut()` is called
4. User is redirected to home page

## File Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth configuration
│   ├── lib/
│   │   ├── hooks/
│   │   │   └── useAuth.ts            # Auth hook for syncing session
│   │   ├── services/
│   │   │   └── auth.ts               # Strapi auth service
│   │   └── utils/
│   │       └── auth.ts               # Logout utility
│   └── dashboard/
│       └── _components/
│           └── dashboard-auth-guard.tsx  # Updated to use NextAuth
├── types/
│   └── next-auth.d.ts                # NextAuth TypeScript types
└── providers/
    └── global-providers.tsx          # Added SessionProvider

backend/
└── src/
    └── extensions/
        └── users-permissions/
            └── strapi-server.ts      # Custom Google OAuth endpoint
```

## Usage Examples

### Using Authentication in Components

```tsx
"use client";

import { useAuth } from "@/app/lib/hooks/useAuth";
import { signIn } from "next-auth/react";

export function MyComponent() {
  const { session, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <button onClick={() => signIn("google")}>Sign In</button>;
  }

  return <div>Welcome, {session?.user?.name}!</div>;
}
```

### Logout

```tsx
import { handleLogout } from "@/app/lib/utils/auth";

<button onClick={handleLogout}>Logout</button>
```

## Testing

1. Start Strapi backend: `cd backend && yarn dev`
2. Start Next.js frontend: `cd frontend && yarn dev`
3. Ensure roles are created in Strapi
4. Ensure environment variables are set
5. Navigate to the app and click "Sign in with Google"
6. Complete Google OAuth flow
7. Verify user is created in Strapi with correct role
8. Verify dashboard access based on role

## Troubleshooting

### "Admin or User role not found"
- Make sure you've created both roles in Strapi admin panel
- Check that role types are exactly `admin` and `user` (lowercase)

### "Failed to register/login user in Strapi"
- Check that Strapi backend is running
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check Strapi logs for errors

### NextAuth errors
- Verify `NEXTAUTH_SECRET` is set
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that redirect URI matches in Google Console

## Next Steps

- [ ] Set up environment variables
- [ ] Create roles in Strapi
- [ ] Configure Google OAuth credentials
- [ ] Test authentication flow
- [ ] Add error handling and user feedback (toast notifications)
- [ ] Consider adding refresh token logic if needed

