"use client";

import { Avatar, Button } from "@mantine/core";
import { Image } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { Artisan } from "@/app/lib/services/artisan";

interface ArtisanBannerProps {
  artisan: Artisan;
}

export function ArtisanBanner({ artisan }: ArtisanBannerProps) {
  const hasPhotos = artisan.reviews && artisan.reviews.some(
    (review) => review.workPhotos && review.workPhotos.length > 0
  );

  return (
    <div className="relative mx-auto w-full h-64 md:h-80">
      {/* Generic banner image placeholder */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-700",
            "dark:from-teal-700 dark:to-teal-900"
          )}
        >
          <div className="absolute inset-0 bg-[url('/stripes.svg')] opacity-10 dark:opacity-5" />
        </div>
      </div>

      {/* Profile photo in bottom-left corner - positioned relative to outer container */}
      <div className="absolute -bottom-4 left-4 md:-bottom-8 md:left-6 z-10">
        <Avatar
          src={artisan.profilePhoto?.url}
          alt={artisan.fullName}
          size={80}
          variant="filled"
          radius="md"
          className="md:w-24 md:h-24"
          color="black"
        >
          {artisan.fullName.charAt(0)}
        </Avatar>
      </div>

      {/* "See all photos" button in top-right */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10">
        <Button
          variant="white"
          leftSection={<Image className="h-4 w-4" />}
          className="bg-white/90 hover:bg-white text-gray-900 dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:text-white"
        >
          Voir toutes les photos
        </Button>
      </div>
    </div>
  );
}
