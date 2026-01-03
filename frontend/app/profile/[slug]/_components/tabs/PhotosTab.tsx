"use client";

import { useState } from "react";
import { Modal } from "@mantine/core";
import NextImage from "next/image";
import { cn } from "@/app/lib/utils";
import type { Artisan } from "@/app/lib/services/artisan";

interface PhotosTabProps {
  artisan: Artisan;
}

export function PhotosTab({ artisan }: PhotosTabProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    alt: string;
  } | null>(null);

  // Collect all work photos from reviews
  const allPhotos = (artisan.reviews || [])
    .flatMap((review) => review.workPhotos || [])
    .map((photo) => ({
      id: photo.id,
      url: photo.url,
      alt: photo.alternativeText || "Photo du travail",
    }));

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
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allPhotos.map((photo) => (
          <div
            key={photo.id}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden",
              "hover:opacity-90 transition-opacity cursor-pointer"
            )}
            onClick={() => setSelectedPhoto(photo)}
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

      {/* Lightbox modal */}
      <Modal
        opened={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        size="xl"
        centered
        padding={0}
      >
        {selectedPhoto && (
          <div className="relative w-full aspect-video">
            <NextImage
              src={selectedPhoto.url}
              alt={selectedPhoto.alt}
              fill
              className="object-contain"
            />
          </div>
        )}
      </Modal>
    </>
  );
}
