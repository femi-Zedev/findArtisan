"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

/**
 * Configuration for which routes should hide the footer
 * Add route paths to this array to hide the footer on those pages
 */
const HIDE_FOOTER_ROUTES = [
  "/search",
  // Add more routes here as needed
  // "/admin",
  // "/artisan/[slug]",
];

export function ConditionalFooter() {
  const pathname = usePathname();

  // Check if current pathname should hide the footer
  const shouldHideFooter = HIDE_FOOTER_ROUTES.some((route) => {
    // Support exact matches and dynamic routes
    if (route.includes("[")) {
      // For dynamic routes like /artisan/[slug], check if pathname starts with the base path
      const basePath = route.split("[")[0];
      return pathname.startsWith(basePath);
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
}

