import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  getEffectiveTheme: () => "light" | "dark";
}

// Helper function to get system preference
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => {
          const effectiveTheme = state.theme === "system" 
            ? getSystemTheme() 
            : state.theme;
          return { theme: effectiveTheme === "dark" ? "light" : "dark" };
        }),
      getEffectiveTheme: () => {
        const state = get();
        return state.theme === "system" ? getSystemTheme() : state.theme;
      },
    }),
    { name: "findartisan-theme" }
  )
);

