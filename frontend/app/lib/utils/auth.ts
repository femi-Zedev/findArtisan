"use client";

import { signOut } from "next-auth/react";
import { useUserStore } from "@/stores/userStore";

/**
 * Logout function that clears NextAuth session and Zustand store
 * This should be called from a component, not used as a hook
 */
export async function handleLogout() {
  try {
    // Clear Zustand store first
    const { clearUser } = useUserStore.getState();
    clearUser();

    // Sign out from NextAuth (this will clear the session)
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    // Even if there's an error, try to clear local state
    const { clearUser } = useUserStore.getState();
    clearUser();
  }
}

