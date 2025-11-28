const STRAPI_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

interface RegisterOrLoginUserParams {
  email: string;
  name: string;
  image?: string | null;
  provider: string;
  providerId: string;
}

interface StrapiUserResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    role: {
      id: number;
      name: string;
      type: string;
      description: string;
    };
  };
}

/**
 * Register or login user in Strapi
 * First user becomes admin, subsequent users become regular users
 * 
 * This function calls a custom Strapi endpoint that handles user registration/login
 * The endpoint should be created in Strapi backend
 */
export async function registerOrLoginUser(
  params: RegisterOrLoginUserParams
): Promise<StrapiUserResponse> {
  const { email, name, image, provider, providerId } = params;

  try {
    // Call custom Strapi endpoint for Google OAuth
    // This endpoint will be created in the Strapi backend
    const response = await fetch(`${STRAPI_API_URL}/auth/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        image,
        provider,
        providerId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || "Failed to register/login user in Strapi");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in registerOrLoginUser:", error);
    throw error;
  }
}

/**
 * Get current user from Strapi using JWT
 */
export async function getStrapiUser(jwt: string) {
  try {
    const response = await fetch(`${STRAPI_API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user from Strapi");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting Strapi user:", error);
    throw error;
  }
}

