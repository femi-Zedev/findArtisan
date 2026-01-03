"use client";

import { useState, useCallback, useMemo } from "react";
import NextImage from "next/image";
import { cn } from "@/app/lib/utils";
import { useModalContext } from "@/providers/modal-provider";
import { CarouselModalContent, type SlideItem } from "@/app/_components/ui";
import type { Artisan } from "@/app/lib/services/artisan";

interface PhotosTabProps {
  artisan: Artisan;
}

export function PhotosTab({ artisan }: PhotosTabProps) {
  const { openModal } = useModalContext();
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);

  // Collect all work photos from reviews and convert to carousel slides format
  const carouselSlides: SlideItem[] = useMemo(() => 
    (artisan.reviews || [])
      .flatMap((review) => review.workPhotos || [])
      .map((photo) => ({
        id: String(photo.id),
        image: photo.url,
        title: photo.alternativeText || "Photo du travail",
      })),
    [artisan.reviews]
  );

  // Also create a simple array for grid display
  const allPhotos = useMemo(() => 
    carouselSlides.map((slide) => ({
      id: slide.id,
      url: slide.image,
      alt: slide.title || "Photo du travail",
    })),
    [carouselSlides]
  );

  // Handle photo click from grid
  const handlePhotoClick = useCallback((photoIndex: number) => {
    setModalCurrentIndex(photoIndex);
    openModal({
      title: "Photos des travaux",
      body: (
        <CarouselModalContent
          slides={carouselSlides}
          initialIndex={photoIndex}
          onIndexChange={setModalCurrentIndex}
        />
      ),
      size: "xl",
      modalContentClassName: "p-4 sm:p-6",
      withCloseButton: true,
    });
  }, [carouselSlides, openModal]);

  if (allPhotos.length === 0) {
    return (
      <div className="text-center py-8 flex flex-col items-center justify-center gap-4">
        <img src="/empty-state/photos_empty.svg" alt="No photos" width={100} />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Aucune photo disponible pour cet artisan.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {allPhotos.map((photo, index) => (
        <div
          key={photo.id}
          className={cn(
            "relative aspect-square rounded-lg overflow-hidden",
            "hover:opacity-90 transition-opacity cursor-pointer"
          )}
          onClick={() => handlePhotoClick(index)}
        >
          <NextImage
            src={photo.url}
            alt={photo.alt}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
