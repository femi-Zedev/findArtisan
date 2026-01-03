"use client";

import { useState, useEffect, useRef } from "react";
import { Button, useMantineColorScheme, useComputedColorScheme, Switch } from "@mantine/core";
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
import { AddArtisan } from "./AddArtisan";

export function Navbar({ className }: { className?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        navbarRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Don't prevent body scroll for dropdown menu
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Mantine color scheme hooks
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const { theme, setTheme } = useThemeStore();

  const { openModal } = useModalContext();
  const { isAuthenticated } = useUserStore();
  const { openDrawer, closeDrawer } = useDrawerContext();

  // Get the effective theme for displaying the correct icon
  const effectiveTheme = theme === "auto" ? computedColorScheme : theme;
  const isMobile = useMediaQuery(`(max-width: 800px)`);
  const router = useRouter();

  // Toggle theme function
  const toggleTheme = () => {
    const currentTheme = theme === "auto" ? computedColorScheme : theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setColorScheme(newTheme);
  };

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
    } else {
      openDrawer({
        body: (
          <AddArtisan />
        ),
        size: "xl",
        asChild: true,
        bodyClassName: "overflow-y-hidden",
      });
    }


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
    <>
      {/* SVG filter for liquid glass distortion effect */}
      {/* <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap in="SourceGraphic" in2="blurred" scale="35" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <style dangerouslySetInnerHTML={{
        __html: `
        .liquid-glass-nav {
          --shadow-offset: 0;
          --shadow-blur: 20px;
          --shadow-spread: -5px;
          --shadow-color: rgba(255, 255, 255, 0.9);
          --tint-color: 255, 255, 255;
          --tint-opacity: 0.04;
          --frost-blur: 2px;
          isolation: isolate;
        }
        .liquid-glass-nav::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: inherit;
          box-shadow: inset var(--shadow-offset) var(--shadow-offset) var(--shadow-blur) var(--shadow-spread) var(--shadow-color);
          background-color: rgba(var(--tint-color), var(--tint-opacity));
          pointer-events: none;
        }
        .liquid-glass-nav::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          backdrop-filter: blur(var(--frost-blur));
          -webkit-backdrop-filter: blur(var(--frost-blur));
          filter: url(#glass-distortion);
          -webkit-filter: url("#glass-distortion");
          isolation: isolate;
          pointer-events: none;
        }
        [data-mantine-color-scheme="dark"] .liquid-glass-nav {
          --shadow-color: rgba(255, 255, 255, 0.01);
          --tint-opacity: 0.01;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `
      }} /> */}

      <nav className={cn("sticky top-0 z-50 w-full top-6", className)} ref={navbarRef}>
        <div className="mx-auto max-w-6xl px-0 px-4 lg:px-8">
          <div
            className={cn(
              "relative transition-colors",
              // "liquid-glass-nav bg-white/10 dark:bg-gray-900/20 rounded-2xl sm:px-5",
              "bg-white/50 dark:bg-gray-900/20 rounded-2xl sm:px-5 backdrop-blur-sm",

              "border border-gray-200/50 dark:border-gray-600/50 shadow-xs",
              isMobile
                ? [
                  "px-4 ",
                  // "bg-white/10 backdrop-blur-md dark:bg-gray-900/40",
                ]
                : [
                  // Desktop: liquid glass card floating over background
                  "overflow-hidden",
                ]
            )}
          >
            {/* Foreground content - relative wrapper like in the HTML */}
            <div className="relative z-10 flex h-16 w-full items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                onClick={handleLinkClick}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
               <img src="/icon.svg" alt="" className="h-6" />
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

                <div className="flex items-center gap-4">

                  <Button
                    rightSection={<ArrowRight className="h-4 w-4" />}
                    size="md"
                    onClick={onNavbarButtonClick}
                    radius="lg">

                    Ajouter un artisan
                  </Button>

                  {isAuthenticated &&
                    <Button
                      onClick={handlePrimaryMobileAction}
                      variant="outline"
                      size="md"
                      radius="lg"
                      className="w-full h-12 rounded-full bg-teal-500 px-6 font-semibold text-white transition-all "
                    >
                      Gérer mes Contributions
                    </Button>}
                </div>
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
                  {effectiveTheme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Mobile Right Side Actions (Burger only) */}
              <div className="flex sm:hidden items-center gap-2">
                {/* Burger Menu Button with Animation */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={cn(
                    "cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300",
                    "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                  aria-label="Toggle menu"
                >
                  <div className="relative w-6 h-6">
                    <Menu
                      className={cn(
                        "absolute inset-0 h-6 w-6 transition-all duration-300",
                        isMobileMenuOpen
                          ? "opacity-0 rotate-90 scale-0"
                          : "opacity-100 rotate-0 scale-100"
                      )}
                    />
                    <X
                      className={cn(
                        "absolute inset-0 h-6 w-6 transition-all duration-300",
                        isMobileMenuOpen
                          ? "opacity-100 rotate-0 scale-100"
                          : "opacity-0 -rotate-90 scale-0"
                      )}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Menu - Dropdown Panel */}
            {isMobileMenuOpen && (
              <div
                ref={mobileMenuRef}
                className={cn(
                  "sm:hidden absolute top-full left-0 right-0 mt-2 z-40",
                  // White rounded panel with backdrop blur
                  // "liquid-glass-nav bg-white/10 dark:bg-gray-900/20",
                  "bg-white dark:bg-gray-900",
                  "rounded-2xl border border-gray-200/50 dark:border-gray-700/50",
                  "shadow-lg",
                  // Slide down animation
                  "animate-[slideDown_0.2s_ease-out]"
                )}
              >
                <div className="overflow-y-auto max-h-[calc(100vh-120px)] px-4 py-4">

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

                  <div className="space-y-4 mt-4">

                    <Button
                      rightSection={<ArrowRight className="h-4 w-4" />}
                      size="md"
                      onClick={onNavbarButtonClick}
                      radius="md"
                      fullWidth>

                      Ajouter un artisan
                    </Button>

                    {isAuthenticated &&
                      <Button
                        onClick={handlePrimaryMobileAction}
                        variant="outline"
                        size="md"
                        fullWidth
                        radius="md"
                        className="w-full h-12 rounded-sm bg-teal-500 px-6 font-semibold text-white transition-all "
                      >
                        Gérer mes Contributions
                      </Button>}
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
