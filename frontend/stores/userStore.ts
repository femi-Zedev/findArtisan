import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserType = 'user' | 'admin' | 'contributor';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  userType?: UserType; // user, admin, or contributor
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  getUserType: () => UserType | null;
  isAdmin: () => boolean;
  isContributor: () => boolean;
  canAccessDashboard: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
      getUserType: () => {
        const state = get();
        return state.user?.userType ?? null;
      },
      isAdmin: () => {
        const state = get();
        return state.user?.userType === 'admin';
      },
      isContributor: () => {
        const state = get();
        return state.user?.userType === 'contributor';
      },
      canAccessDashboard: () => {
        const state = get();
        return state.isAuthenticated && (state.user?.userType === 'admin' || state.user?.userType === 'contributor');
      },
    }),
    { name: "findartisan-user" }
  )
);

