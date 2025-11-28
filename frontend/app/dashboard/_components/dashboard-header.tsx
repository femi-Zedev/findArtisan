"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Bell, Menu, Sun, Moon, Home } from "lucide-react";
import { Button, TextInput } from "@mantine/core";
import { cn } from "@/app/lib/utils";
import { useThemeStore } from "@/stores/themeStore";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardHeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export function DashboardHeader({ onMobileMenuToggle, isMobileMenuOpen }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = ["Pages"];

    // French translations for common paths
    const translations: Record<string, string> = {
      dashboard: "Tableau de bord",
      artisans: "Artisans",
      submissions: "Soumissions",
      contributions: "Contributions",
      "add-artisan": "Ajouter un Artisan",
      profile: "Profil",
    };

    paths.forEach((path) => {
      const translated = translations[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      breadcrumbs.push(translated);
    });

    return breadcrumbs.join(" / ");
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 lg:px-6 h-18">
          {/* Left: Mobile menu button and breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href="/"
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              aria-label="Retour à l'accueil"
            >
              <Home className="h-5 w-5" />
            </Link>
            <div className="hidden sm:block">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {generateBreadcrumbs()}
              </p>
            </div>
          </div>

          {/* Right: Search, notifications, settings, user */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:block w-64">
              <TextInput
                placeholder="Rechercher..."
                leftSection={<Search className="h-4 w-4 text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                size="sm"
              />
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={cn(
                "cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              )}
              aria-label="Changer le thème"
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <button
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings - Commented out for now */}
            {/* <button
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button> */}
          </div>
        </div>
      </header>
    </>
  );
}

