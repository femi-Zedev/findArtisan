import bcrypt from 'bcryptjs';

export default (plugin: any) => {
  // Capture the original auth controller factory function
  const originalAuthFactory = plugin.controllers.auth;

  // Create a new factory function that extends the original
  plugin.controllers.auth = ({ strapi }: { strapi: any }) => {
    // Get the original auth controller by calling the factory
    const originalAuth = originalAuthFactory({ strapi });

    // Add our custom method to the auth controller
    originalAuth.googleCallback = async (ctx: any) => {
      try {
        const { email, name, image, provider, providerId } = ctx.request.body;

        if (!email || !name) {
          return ctx.badRequest('Email and name are required');
        }

        // Check if user already exists
        const existingUsers = await strapi.entityService.findMany('plugin::users-permissions.user', {
          filters: { email },
          populate: ['role'],
        });

        let user;
        let isFirstUser = false;

        if (existingUsers && existingUsers.length > 0) {
          // User exists, return existing user
          user = existingUsers[0];
        } else {
          // Check if this is the first user
          const allUsers = await strapi.entityService.findMany('plugin::users-permissions.user', {
            populate: ['role'],
          });
          isFirstUser = allUsers.length === 0;

          // Get roles
          const roles = await strapi.entityService.findMany('plugin::users-permissions.role', {});
          const adminRole = roles.find((r: any) => r.type === 'admin');
          const userRole = roles.find((r: any) => r.type === 'user');

          if (!adminRole || !userRole) {
            return ctx.badRequest('Admin or User role not found in Strapi. Please create these roles first.');
          }

          const roleId = isFirstUser ? adminRole.id : userRole.id;

          // Create new user with random password (OAuth users don't need password)
          // Use bcryptjs directly since hashPassword service method may not be available
          const randomPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          user = await strapi.entityService.create('plugin::users-permissions.user', {
            data: {
              username: name,
              email,
              provider: provider || 'google',
              confirmed: true,
              blocked: false,
              role: roleId,
              password: hashedPassword,
            },
            populate: ['role'],
          });
        }

        // Generate JWT token
        const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        });

        // Return user with JWT
        ctx.body = {
          jwt,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            provider: user.provider,
            confirmed: user.confirmed,
            blocked: user.blocked,
            role: user.role,
          },
        };
      } catch (error: any) {
        strapi.log.error('Error in googleCallback:', error);
        ctx.internalServerError(error.message || 'An error occurred during authentication');
      }
    };

    // Return the extended controller
    return originalAuth;
  };

  // Add custom Google OAuth callback route
  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/auth/google/callback',
    handler: 'auth.googleCallback',
    config: {
      prefix: '',
      auth: false, // Make route publicly accessible
      policies: [],
    },
  });

  return plugin;
};

