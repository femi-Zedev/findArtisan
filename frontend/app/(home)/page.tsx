"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useComputedColorScheme } from "@mantine/core";
import { HeroSection } from "../_sections/hero-section";
import { RecentlyAddedSection } from "../_sections/recently-added-section";
import { FAQSection } from "../_sections/faq-section";
import { ContactSection } from "../_sections/contact-section";
import { useDrawerContext } from "@/providers/drawer-provider";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { AddArtisanSelection } from "../_components/forms/AddArtisanSelection";
import { GradientBlurAccent } from "../_components/gradient-blur-accent";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openDrawer, closeDrawer } = useDrawerContext();
  const { isAuthenticated, isLoading } = useAuth();
  const computedColorScheme = useComputedColorScheme('light');
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
      {/* Stripes background pattern */}
      <div
        className="pointer-events-none absolute left-0 top-0 w-full md:left-1/2 md:w-auto md:-translate-x-1/2 -z-10"
        aria-hidden="true"
      >
        <img
          src={computedColorScheme === 'dark' ? '/stripes-dark.svg' : '/stripes.svg'}
          alt="Stripes"
          width="768"
          height="428"
          className="w-full h-auto md:w-auto md:max-w-[768px]"
          style={{ color: 'transparent' }}
        />
      </div>

      {/* Decorative gradient blur for HeroSection */}
      <div className="relative">
        <GradientBlurAccent
          position="right"
          top="600px"
          gradientFrom="from-blue-500"
          gradientTo="to-gray-900"
        />
        <HeroSection />
      </div>

      <div id="artisans" className="relative z-10">
        <RecentlyAddedSection />
        
        {/* Decorative gradient blur for RecentlyAddedSection (bottom accent) */}
        <GradientBlurAccent
          position="left"
          bottom="500px"
          gradientFrom="from-blue-500"
          gradientTo="to-gray-600"
        />
      </div>

      <div className="relative">
        <FAQSection />
        
        {/* Decorative gradient blur for FAQSection */}
        <GradientBlurAccent
          position="right"
          top="400px"
          gradientFrom="from-purple-500"
          gradientTo="to-pink-600"
        />
      </div>

      <ContactSection />
    </>
  );
}