import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserType = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  userType?: UserType; // user or admin
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  getUserType: () => UserType | null;
  isAdmin: () => boolean;
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
      canAccessDashboard: () => {
        const state = get();
        return state.isAuthenticated && (state.user?.userType === 'admin' || state.user?.userType === 'user');
      },
    }),
    { name: "findartisan-user" }
  )
);

