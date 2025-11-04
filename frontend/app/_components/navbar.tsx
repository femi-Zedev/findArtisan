"use client";

import { Button } from "@mantine/core";
import { Wrench, Plus, Sun, Moon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";
import { useThemeStore } from "../../stores/themeStore";

export function Navbar() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <nav className="sticky top-4 z-50 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex h-16 items-center justify-between rounded-2xl px-5 shadow-xs transition-colors",
            "bg-white/60 backdrop-blur-md border border-gray-200/50",
            "dark:bg-gray-900/60 dark:backdrop-blur-md dark:border-gray-800/50"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              FindArtisan
            </span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Button
              component={Link}
              href="/add-artisan"
              rightSection={<ArrowRight className="h-4 w-4" />}
              size="md"
              className="h-10 rounded-full bg-teal-500 px-6 font-semibold text-white transition-all hover:bg-teal-600 shadow-sm hover:shadow-md"
            >
              <span className="hidden sm:inline">Ajouter un artisan</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={cn(
                "cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl transition-all shadow-sm",
                "border bg-teal-50 backdrop-blur-sm text-teal-700 hover:bg-teal-100 border-teal-600",
                "dark:border-teal-200 dark:bg-teal-900/80 dark:text-teal-300 dark:hover:bg-teal-900"
              )}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
