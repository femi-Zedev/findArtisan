"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import type { UserType } from "@/stores/userStore";

/**
 * Hook to sync NextAuth session with Zustand user store
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    if (status === "loading") {
      return; // Still loading
    }

    if (status === "authenticated" && session?.user) {
      // Sync NextAuth session to Zustand store
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || undefined,
        userType: session.user.userType as UserType,
      });
    } else if (status === "unauthenticated") {
      // Clear user from store
      clearUser();
    }
  }, [session, status, setUser, clearUser]);

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}

