"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HeroSection } from "../_sections/hero-section";
import { RecentlyAddedSection } from "../_sections/recently-added-section";
import { FAQSection } from "../_sections/faq-section";
import { ContactSection } from "../_sections/contact-section";
import { useDrawerContext } from "@/providers/drawer-provider";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { AddArtisanSelection } from "../_components/forms/AddArtisanSelection";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openDrawer, closeDrawer } = useDrawerContext();
  const { isAuthenticated, isLoading } = useAuth();
  const openDrawerParam = searchParams.get("openDrawer");
  const hasOpenedDrawerRef = useRef(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // If user is authenticated and openDrawer parameter is present, open the drawer
    // Use ref to prevent opening multiple times
    if (isAuthenticated && openDrawerParam === "addArtisan" && !hasOpenedDrawerRef.current) {
      hasOpenedDrawerRef.current = true;

      openDrawer({
        title: "Ajouter un artisan",
        body: (
          <AddArtisanSelection
            onSuccess={(values) => {
              // TODO: Implement API call to submit artisan
              console.log("Artisan added:", values);
              closeDrawer();
              // TODO: Show success toast notification
            }}
          />
        ),
        size: "xl",
        bodyClassName: "p-6 overflow-y-hidden",
      });

      // Remove the query parameter from URL
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("openDrawer");
      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl);
    }

    // Reset ref when the query parameter changes or user logs out
    if (!openDrawerParam || !isAuthenticated) {
      hasOpenedDrawerRef.current = false;
    }
  }, [isAuthenticated, isLoading, openDrawerParam, searchParams, router]);

  return (
    <>
      <HeroSection />
      <div id="artisans" className="relative z-10">
        <RecentlyAddedSection />
      </div>
      <FAQSection />
      <ContactSection />
    </>
  );
}