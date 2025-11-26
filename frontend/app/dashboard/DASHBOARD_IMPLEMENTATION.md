# Dashboard Implementation Guide

## Overview

This document outlines the dashboard implementation for FindArtisan, including authentication, role management, and next steps.

## Language & Localization

**Important:** All UI content in the FindArtisan application is in **French**. This includes:
- All user-facing text, labels, and messages
- Form labels and placeholders
- Error messages and notifications
- Dashboard navigation items
- Button labels and action text
- Page titles and descriptions

When implementing new features or components, ensure all text content is in French. The codebase uses French throughout (e.g., "Ajouter un artisan", "Connexion requise", "Tableau de bord").

## Current Implementation Status

### ✅ Completed

1. **Dashboard Layout Structure**
   - Sidebar navigation with role-based menu items
   - Header with breadcrumbs, search, notifications, and user profile
   - Responsive mobile menu
   - Footer

2. **User Store Updates**
   - Added `userType` field to User interface (`user`, `admin`, `contributor`)
   - Added helper methods: `getUserType()`, `isAdmin()`, `isContributor()`, `canAccessDashboard()`

3. **Dummy Auth Guard**
   - Basic authentication check using Zustand store
   - Role-based access control
   - Loading and error states

4. **Dashboard Page**
   - Welcome section with user info
   - Stats cards (placeholder)
   - Quick actions section

## Role Management Architecture

### Current Approach: Custom UserType Field

Instead of using Strapi's built-in role/permission system, we're using a simple `userType` field on the User model. This approach offers:

**Advantages:**
- ✅ Simpler implementation - no complex permission system
- ✅ Easy to understand and maintain
- ✅ Flexible for MVP - can migrate to Strapi roles later if needed
- ✅ Direct control over user types without Strapi admin complexity

**User Types:**
- `user` - Default for all registered users (cannot access dashboard)
  - UI Label: "Utilisateur" or "Utilisateur régulier"
- `contributor` - Can access dashboard, manage their contributions, add artisans
  - UI Label: "Contributeur"
- `admin` - Full access to dashboard, can manage all artisans, review submissions
  - UI Label: "Administrateur"

### Recommended Backend Structure

#### 1. User Collection Type (Strapi)

```typescript
// User Collection Type
{
  username: string (required, unique)
  email: string (required, unique)
  password: string (required, hashed)
  userType: enum ['user', 'admin', 'contributor'] (default: 'user')
  profile: {
    fullName: string
    avatar: Media (single)
    phone: string
  }
  // Relations
  contributedArtisans: Artisan[] (many-to-many, optional)
  createdAt: datetime
  updatedAt: datetime
}
```

#### 2. UserType Single Type (Alternative - if you want to manage types separately)

```typescript
// UserType Single Type (optional - for managing type definitions)
{
  types: [
    {
      name: 'user'
      label: 'Regular User'
      permissions: []
    },
    {
      name: 'contributor'
      label: 'Contributor'
      permissions: ['add_artisan', 'edit_own_artisan', 'view_own_contributions']
    },
    {
      name: 'admin'
      label: 'Administrator'
      permissions: ['*'] // All permissions
    }
  ]
}
```

**Recommendation:** Use the enum field approach (option 1) for simplicity. The Single Type approach adds unnecessary complexity for an MVP.

#### 3. First User Admin Logic

**Backend Middleware/Service (Strapi):**

```typescript
// backend/src/api/user/services/user.ts (or lifecycle hook)
export default factories.createCoreService('api::user.user', ({ strapi }) => ({
  async create(data) {
    // Check if this is the first user
    const userCount = await strapi.entityService.count('api::user.user');
    
    if (userCount === 0) {
      // First user becomes admin
      data.userType = 'admin';
    } else {
      // All other users default to 'user'
      data.userType = data.userType || 'user';
    }
    
    return await strapi.entityService.create('api::user.user', { data });
  },
}));
```

Or use a lifecycle hook:

```typescript
// backend/src/api/user/content-types/user/lifecycles.ts
export default {
  async beforeCreate(event) {
    const { data } = event.params;
    const userCount = await strapi.entityService.count('api::user.user');
    
    if (userCount === 0) {
      data.userType = 'admin';
    } else {
      data.userType = data.userType || 'user';
    }
  },
};
```

## Next Steps

### Phase 1: Backend Setup (Priority: High)

1. **Update User Collection Type in Strapi**
   - [ ] Add `userType` enum field to User collection type
   - [ ] Set default value to `'user'`
   - [ ] Add validation to only allow: `'user'`, `'admin'`, `'contributor'`

2. **Implement First User Admin Logic**
   - [ ] Create lifecycle hook or service method to set first user as admin
   - [ ] Test that first registered user gets `userType: 'admin'`
   - [ ] Test that subsequent users get `userType: 'user'` by default

3. **Create Authentication Endpoints**
   - [ ] `POST /api/auth/local/register` - User registration
   - [ ] `POST /api/auth/local` - User login
   - [ ] `POST /api/auth/logout` - User logout
   - [ ] `GET /api/users/me` - Get current user (with userType)
   - [ ] Ensure JWT tokens are returned and can be validated

4. **Update Artisan Model (if needed)**
   - [ ] Add relation to User (contributor) - optional, for tracking who added which artisan
   - [ ] Consider adding `submittedBy` field to track community submissions

### Phase 2: Frontend Authentication (Priority: High)

1. **Create Auth Service**
   - [ ] Create `frontend/app/lib/services/auth.ts` with:
     - `register(email, password, username)`
     - `login(email, password)`
     - `logout()`
     - `getCurrentUser()`
   - [ ] Store JWT token securely (consider httpOnly cookies or secure storage)

2. **Update User Store**
   - [ ] Add `token` field to store JWT
   - [ ] Add `login()` method that calls auth service and updates store
   - [ ] Add `logout()` method that clears token and user
   - [ ] Add `refreshUser()` method to fetch current user from `/api/users/me`
   - [ ] Add token refresh logic if needed

3. **Create Auth Components**
   - [ ] Create login form component (all labels in French: "Connexion", "Email", "Mot de passe", etc.)
   - [ ] Create registration form component (all labels in French: "Inscription", "Nom d'utilisateur", etc.)
   - [ ] Update `GoogleLoginModal` to use actual auth service (or remove if not using Google OAuth)
   - [ ] Ensure all error messages and validation messages are in French

4. **Update Auth Guard**
   - [ ] Replace dummy guard with real authentication check
   - [ ] Add token validation
   - [ ] Add automatic token refresh on expiry
   - [ ] Add redirect to login page if not authenticated

5. **Add Auth Middleware/Interceptor**
   - [ ] Update `api-client.ts` to include JWT token in headers
   - [ ] Add automatic token refresh on 401 responses
   - [ ] Handle token expiry gracefully

### Phase 3: Dashboard Features (Priority: Medium)

1. **Admin Dashboard Pages**
   - [ ] `/dashboard/artisans` - List all artisans with CRUD operations
     - Page title: "Gestion des Artisans"
     - All labels and actions in French
   - [ ] `/dashboard/submissions` - Review community submissions
     - Page title: "Soumissions Communautaires"
     - Actions: "Approuver", "Rejeter", "Modifier"
   - [ ] `/dashboard/statistics` - Platform statistics and analytics
     - Page title: "Statistiques"
     - All metrics and labels in French

2. **Contributor Dashboard Pages**
   - [ ] `/dashboard/contributions` - List user's contributed artisans
     - Page title: "Mes Contributions"
     - Status labels: "En attente", "Approuvé", "Rejeté"
   - [ ] `/dashboard/add-artisan` - Form to add new artisan
     - Page title: "Ajouter un Artisan"
     - All form fields in French (already implemented in existing form)
   - [ ] `/dashboard/profile` - User profile management
     - Page title: "Profil"
     - Form labels: "Nom complet", "Email", "Téléphone", etc.

3. **Shared Pages**
   - [ ] `/dashboard/profile` - Profile editing (both admin and contributor)
   - [ ] `/dashboard/settings` - Account settings

4. **Implement Features**
   - [ ] Artisan management (CRUD operations)
   - [ ] Submission review workflow (approve/reject/edit)
   - [ ] Contribution tracking for contributors
   - [ ] Real statistics and metrics

### Phase 4: Role Management UI (Priority: Low)

1. **Admin User Management**
   - [ ] Create admin interface to change user types
     - Page title: "Gestion des Utilisateurs"
     - Actions: "Promouvoir en Contributeur", "Promouvoir en Administrateur", "Rétrograder"
   - [ ] List all users with their types
     - Table headers: "Nom", "Email", "Type d'utilisateur", "Actions"
   - [ ] Ability to promote users to contributor or admin
   - [ ] Ability to demote users back to regular user

2. **User Type Requests**
   - [ ] Allow users to request contributor status
     - Button: "Demander le statut de contributeur"
   - [ ] Admin approval workflow for contributor requests
     - Status labels: "En attente", "Approuvé", "Rejeté"
   - [ ] Notification system for status changes
     - Messages: "Votre demande de contributeur a été approuvée", etc.

## API Endpoints Needed

### Authentication
```
POST   /api/auth/local/register
POST   /api/auth/local
POST   /api/auth/logout
GET    /api/users/me
```

### User Management (Admin only)
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
PUT    /api/users/:id/user-type  // Change user type
```

### Artisan Management
```
GET    /api/artisans
GET    /api/artisans/:id
POST   /api/artisans
PUT    /api/artisans/:id
DELETE /api/artisans/:id
```

### Community Submissions
```
GET    /api/community-submissions
GET    /api/community-submissions/:id
POST   /api/community-submissions
PUT    /api/community-submissions/:id/approve
PUT    /api/community-submissions/:id/reject
DELETE /api/community-submissions/:id
```

## Security Considerations

1. **JWT Token Storage**
   - Consider using httpOnly cookies for better security
   - If using localStorage, ensure HTTPS in production
   - Implement token refresh mechanism

2. **API Route Protection**
   - Ensure Strapi routes are properly protected
   - Admin-only routes should check `userType === 'admin'`
   - Contributor routes should check `userType === 'contributor' || userType === 'admin'`

3. **Input Validation**
   - Validate all user inputs on both frontend and backend
   - Sanitize data before storing in database
   - Use Strapi's built-in validation

4. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Prevent brute force attacks on login

## Testing Checklist

- [ ] First user registration creates admin account
- [ ] Subsequent users get 'user' type by default
- [ ] Admin can access all dashboard sections
- [ ] Contributor can access contributor sections only
- [ ] Regular users cannot access dashboard
- [ ] JWT tokens are properly stored and sent with requests
- [ ] Token expiry is handled gracefully
- [ ] Logout clears all user data
- [ ] Protected routes redirect to login if not authenticated

## Migration Path (Future)

If you later want to migrate to Strapi's built-in role system:

1. Create roles in Strapi admin: `user`, `contributor`, `admin`
2. Create permissions for each role
3. Migrate existing `userType` values to roles
4. Update frontend to check roles instead of `userType`
5. Remove `userType` field from User model

This migration can be done without breaking changes if planned carefully.

## Questions to Consider

1. **Should contributors be able to edit their own submissions?**
   - Recommendation: Yes, allow editing of own contributions before approval

2. **Should there be a limit on how many artisans a contributor can add?**
   - Recommendation: No limit for MVP, can add later if needed

3. **How should admin promote users to contributor?**
   - Recommendation: Manual promotion through admin dashboard for MVP

4. **Should there be a contributor application process?**
   - Recommendation: Keep it simple for MVP - admin can promote users directly

5. **What happens when an admin demotes a contributor?**
   - Recommendation: Keep their contributions but remove dashboard access

## Notes

- The current dummy guard will need to be replaced with real authentication
- All API endpoints need to be implemented in Strapi backend
- Consider adding loading states and error handling throughout
- Mobile responsiveness is important - test on various screen sizes
- Consider adding analytics/tracking for dashboard usage

## French UI Text Reference

When implementing new features, use these French translations:

### Common Actions
- "Ajouter" = Add
- "Modifier" = Edit
- "Supprimer" = Delete
- "Enregistrer" = Save
- "Annuler" = Cancel
- "Rechercher" = Search
- "Filtrer" = Filter
- "Approuver" = Approve
- "Rejeter" = Reject
- "Voir" = View
- "Exporter" = Export

### Dashboard Navigation
- "Tableau de bord" = Dashboard
- "Artisans" = Artisans
- "Soumissions" = Submissions
- "Contributions" = Contributions
- "Profil" = Profile
- "Paramètres" = Settings

### Status Labels
- "En attente" = Pending
- "Approuvé" = Approved
- "Rejeté" = Rejected
- "Actif" = Active
- "Inactif" = Inactive

### User Types
- "Utilisateur" = User
- "Contributeur" = Contributor
- "Administrateur" = Administrator

### Error Messages
- "Une erreur s'est produite" = An error occurred
- "Champ requis" = Required field
- "Email invalide" = Invalid email
- "Mot de passe trop court" = Password too short
- "Connexion requise" = Login required
- "Accès refusé" = Access denied

