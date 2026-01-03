"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@mantine/core";
import { cn } from "@/app/lib/utils";
import type { Artisan } from "@/app/lib/services/artisan";
import { OverviewTab } from "./tabs/OverviewTab";
import { ServicesTab } from "./tabs/ServicesTab";
import { ReviewsTab } from "./tabs/ReviewsTab";
import { PhotosTab } from "./tabs/PhotosTab";

interface ArtisanTabsProps {
  artisan: Artisan;
}

export function ArtisanTabs({ artisan }: ArtisanTabsProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const overviewRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to update active section on scroll
  useEffect(() => {
    const sections = [
      { id: "overview", ref: overviewRef.current },
      { id: "services", ref: servicesRef.current },
      { id: "reviews", ref: reviewsRef.current },
      { id: "photos", ref: photosRef.current },
    ].filter((s) => s.ref !== null) as Array<{ id: string; ref: HTMLDivElement }>;

    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -50% 0px", // Trigger when section is near top
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = sections.find(
            (s) => s.ref === entry.target
          )?.id;
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      observer.observe(section.ref);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section.ref);
      });
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      overview: overviewRef,
      services: servicesRef,
      reviews: reviewsRef,
      photos: photosRef,
    };

    const targetRef = refs[sectionId];
    if (targetRef?.current) {
      const offset = 100; // Offset for sticky header/navbar
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-6">
      {/* Navigation buttons */}
      <div className="sticky top-4 z-20 bg-teal-50/80 dark:bg-gray-900/80 my-4 -mx-6 px-4 py-3 rounded-xl backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Button
            variant={activeSection === "overview" ? "filled" : "subtle"}
            onClick={() => scrollToSection("overview")}
            className={cn(
              "shrink-0",
              activeSection === "overview"
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            Vue d'ensemble
          </Button>
          <Button
            variant={activeSection === "services" ? "filled" : "subtle"}
            onClick={() => scrollToSection("services")}
            className={cn(
              "shrink-0",
              activeSection === "services"
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            Services
          </Button>
          <Button
            variant={activeSection === "reviews" ? "filled" : "subtle"}
            onClick={() => scrollToSection("reviews")}
            className={cn(
              "shrink-0",
              activeSection === "reviews"
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            Avis
          </Button>
          <Button
            variant={activeSection === "photos" ? "filled" : "subtle"}
            onClick={() => scrollToSection("photos")}
            className={cn(
              "shrink-0",
              activeSection === "photos"
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            Photos
          </Button>
        </div>
      </div>

      {/* All sections displayed vertically */}
      <div className="space-y-12">
        {/* Overview Section */}
        <div id="overview" ref={overviewRef} className="scroll-mt-24">
          <OverviewTab artisan={artisan} />
        </div>

        {/* Services Section */}
        <div id="services" ref={servicesRef} className="scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Services & compétences
          </h2>
          <ServicesTab artisan={artisan} />
        </div>

        {/* Reviews Section */}
        <div id="reviews" ref={reviewsRef} className="scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Avis clients
          </h2>
          <ReviewsTab artisan={artisan} />
        </div>

        {/* Photos Section */}
        <div id="photos" ref={photosRef} className="scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Photos des travaux
          </h2>
          <PhotosTab artisan={artisan} />
        </div>
      </div>
    </div>
  );
}
