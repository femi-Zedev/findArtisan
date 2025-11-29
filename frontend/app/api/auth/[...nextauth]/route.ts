import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { registerOrLoginUser } from "@/app/lib/services/auth";

const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email && user.name) {
        try {
          // Register or login user in Strapi
          const strapiUser = await registerOrLoginUser({
            email: user.email,
            name: user.name,
            image: user.image || null,
            provider: "google",
            providerId: account.providerAccountId,
          });

          // Attach Strapi user data to NextAuth user object
          (user as any).strapiId = String(strapiUser.user.id);
          (user as any).strapiJwt = strapiUser.jwt;
          (user as any).userType = (strapiUser.user.role?.type as "admin" | "user") || "user";

          return true;
        } catch (error) {
          console.error("Error registering/login user in Strapi:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user && account) {
        (token as any).strapiId = (user as any).strapiId;
        (token as any).strapiJwt = (user as any).strapiJwt;
        (token as any).userType = (user as any).userType;
        token.email = user.email || undefined;
        token.name = user.name || undefined;
        token.picture = user.image || undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = (token as any).strapiId || "";
        (session.user as any).strapiJwt = (token as any).strapiJwt || "";
        (session.user as any).userType = (token as any).userType || "user";
        session.user.email = token.email || "";
        session.user.name = token.name || "";
        session.user.image = token.picture || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

export const { GET, POST } = handlers;