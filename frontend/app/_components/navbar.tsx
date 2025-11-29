"use client";

import { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Wrench, Sun, Moon, ArrowRight, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "../lib/utils";
import { useThemeStore } from "../../stores/themeStore";
import { useModalContext } from "@/providers/modal-provider";
import { useUserStore } from "@/stores/userStore";
import { GoogleLoginModal } from "./modals/GoogleLoginModal";
import { useDrawerContext } from "@/providers/drawer-provider";
import { AddArtisanSelection } from "./forms/AddArtisanSelection";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { openModal } = useModalContext();
  const { isAuthenticated } = useUserStore();
  const { openDrawer, closeDrawer } = useDrawerContext();
  const isMobile = useMediaQuery(`(max-width: 800px)`);
  const router = useRouter();

  const onNavbarButtonClick = () => {
    // Close mobile menu if open
    setIsMobileMenuOpen(false);

    // If user is not authenticated, show login modal first
    if (!isAuthenticated) {
      openModal({
        title: "Connexion requise",
        body: <GoogleLoginModal />,
        size: "md",
        withCloseButton: true,
      });
      return;
    }

    router.push("/dashboard");


  };

  const handlePrimaryMobileAction = () => {
    if (isAuthenticated) {
      // Close mobile menu and navigate to dashboard
      setIsMobileMenuOpen(false);
      router.push("/dashboard");
      return;
    }

    // Fallback to existing flow for unauthenticated users
    onNavbarButtonClick();
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full sm:top-4">
      <div className="mx-auto max-w-6xl px-0 sm:px-4 lg:px-8">
        <div
          className={cn(
            "flex h-16 items-center justify-between shadow-xs transition-colors",
            // Mobile: match layout background colors (blue-50 to gray-50 gradient)
            isMobile
              ? "bg-blue-50/80 backdrop-blur-md dark:bg-gray-950/80 px-4"
              : "bg-white/60 backdrop-blur-md border-b border-gray-200/50 dark:bg-gray-900/60 dark:backdrop-blur-md dark:border-gray-800/50 sm:rounded-2xl sm:border sm:px-5"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              FindArtisan
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/search"
              onClick={handleLinkClick}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Recherche
            </Link>
            <Link
              href="/#faq"
              onClick={handleLinkClick}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/#contact"
              onClick={handleLinkClick}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Right Side Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              onClick={onNavbarButtonClick}
              rightSection={<ArrowRight className="h-4 w-4" />}
              size="md"
              className="h-10 rounded-full bg-teal-500 px-6 font-semibold text-white transition-all hover:bg-teal-600 shadow-sm hover:shadow-md"
            >
              {isAuthenticated ? "Gérer mes Contributions" : "Ajouter un artisan"}
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

          {/* Mobile Right Side Actions (Burger only) */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Burger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "cursor-pointer flex h-10 w-10 items-center justify-center  transition-all",
                " text-gray-700 hover:bg-gray-100 ",
                "dark:text-gray-300 dark:hover:bg-gray-700"
              )}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full Height */}
        {isMobileMenuOpen && (
          <div
            className={cn(
              "sm:hidden fixed inset-0 top-16 z-40",
              "bg-blue-50/80 backdrop-blur-md dark:bg-gray-950/80",
              "border-t border-gray-200/30 dark:border-gray-800/30",
              "flex flex-col"
            )}
          >
            <div className="flex-1 overflow-y-auto px-4 py-6">

              {/* Menu Links with arrow design */}
              <div className="space-y-0">
                <Link
                  href="/search"
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center justify-between px-4 py-3",
                    "text-gray-900 dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "transition-colors font-medium",
                    "border-b border-gray-200/50 dark:border-gray-800/50"
                  )}
                >
                  <span>Recherche</span>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </Link>
                <Link
                  href="/#faq"
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center justify-between px-4 py-3",
                    "text-gray-900 dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "transition-colors font-medium",
                    "border-b border-gray-200/50 dark:border-gray-800/50"
                  )}
                >
                  <span>FAQs</span>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </Link>
                <Link
                  href="/#contact"
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center justify-between px-4 py-3",
                    "text-gray-900 dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "transition-colors font-medium",
                    "border-b border-gray-200/50 dark:border-gray-800/50"
                  )}
                >
                  <span>Contact</span>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </Link>
              </div>

              {/* Theme Toggle Dropdown */}
              <div className="mt-6 space-y-0">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Préférences
                </div>
                <button
                  onClick={toggleTheme}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3",
                    "text-gray-900 dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "transition-colors font-medium",
                    "border-b border-gray-200/50 dark:border-gray-800/50"
                  )}
                  aria-label="Toggle theme"
                >
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                    <span>Thème {theme === "dark" ? "sombre" : "clair"}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </button>
              </div>

              <Button
                onClick={handlePrimaryMobileAction}
                rightSection={<ArrowRight className="h-4 w-4" />}
                size="md"
                fullWidth
                radius="md"
                className="w-full h-12 mt-6 rounded-sm bg-teal-500 px-6 font-semibold text-white transition-all "
              >
                {isAuthenticated ? "Gérer mes Contributions" : "Ajouter un artisan"}
              </Button>
            </div>


          </div>
        )}
      </div>
    </nav>
  );
}
