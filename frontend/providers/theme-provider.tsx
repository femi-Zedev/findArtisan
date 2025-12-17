"use client";

import { useMantineColorScheme } from "@mantine/core";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check localStorage for saved preference
    const saved = localStorage.getItem('findartisan-theme-color-scheme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const theme = parsed?.state?.theme;
        if (theme === 'light' || theme === 'dark' || theme === 'auto') {
          setColorScheme(theme);
        } else {
          setColorScheme('auto');
        }
      } catch {
        setColorScheme('auto');
      }
    } else {
      // Default to auto (system preference)
      setColorScheme('auto');
    }
  }, [setColorScheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const saved = localStorage.getItem('findartisan-theme-color-scheme');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const theme = parsed?.state?.theme;
          if (theme === 'auto' || !theme) {
            // Force re-evaluation when in auto mode
            setColorScheme('auto');
          }
        } catch {
          setColorScheme('auto');
        }
      } else {
        setColorScheme('auto');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [mounted, setColorScheme]);

  return <>{children}</>;
}

