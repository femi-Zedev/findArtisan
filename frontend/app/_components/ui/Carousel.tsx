"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FallbackImage from "./FallbackImage";

export interface SlideItem {
  id: string;
  image: string; // Required property
  [key: string]: any; // Allows for any additional properties
  format?: string;
  title?: string;
  grail?: boolean;
}

interface CarouselProps {
  slides: SlideItem[];
  className?: string;
  thumbnailLimit?: number;
  buttonPosition?: "absolute" | "relative";
  currentIndex?: number;
  onSlideChange?: (index: number) => void;
  onSlideClick?: (id: string) => void;
}

export default function Carousel({
  slides,
  className,
  thumbnailLimit = 6,
  buttonPosition = "absolute",
  currentIndex: externalCurrentIndex,
  onSlideChange,
  onSlideClick,
}: CarouselProps) {
  const [internalCurrentIndex, setInternalCurrentIndex] = useState(0);

  // Use external index if provided, otherwise use internal state
  const currentIndex =
    externalCurrentIndex !== undefined ? externalCurrentIndex : internalCurrentIndex;

  // Update internal state when external index changes
  useEffect(() => {
    if (externalCurrentIndex !== undefined) {
      setInternalCurrentIndex(externalCurrentIndex);
    }
  }, [externalCurrentIndex]);

  // Unified navigation handler
  const handleNavigation = (direction: 'next' | 'prev') => {
    if (slides.length <= 1) return;

    const newIndex = direction === 'next'
      ? (currentIndex === slides.length - 1 ? 0 : currentIndex + 1)
      : (currentIndex === 0 ? slides.length - 1 : currentIndex - 1);

    // If externally controlled, only notify parent via callback
    if (externalCurrentIndex !== undefined) {
      onSlideChange?.(newIndex);
    } else {
      // If internally controlled, update state
      setInternalCurrentIndex(newIndex);
      onSlideChange?.(newIndex);
    }
  };

  const nextSlide = () => handleNavigation('next');
  const previousSlide = () => handleNavigation('prev');

  const goToSlide = (index: number) => {
    // If externally controlled, only notify parent
    if (externalCurrentIndex !== undefined) {
      onSlideChange?.(index);
    } else {
      // If internally controlled, update state
      setInternalCurrentIndex(index);
      onSlideChange?.(index);
    }
  };

  const getVisibleThumbnails = () => {
    const totalSlides = slides.length;
    const visibleRangeStart = Math.floor(currentIndex / thumbnailLimit) * thumbnailLimit;
    const visibleRangeEnd = Math.min(visibleRangeStart + thumbnailLimit, totalSlides);
    return slides.slice(visibleRangeStart, visibleRangeEnd);
  };

  const visibleThumbnails = getVisibleThumbnails();

  if (slides.length === 0) {
    return null;
  }

  // Check if title is meaningful (not just default "Photo du travail")
  const hasMeaningfulTitle = slides[currentIndex]?.title && 
    slides[currentIndex].title !== "Photo du travail";

  return (
    <div className={cn("relative flex flex-col items-center justify-center w-full", className)}>
      {/* Title Section - Only show if meaningful */}
      {hasMeaningfulTitle && (
        <div className="mb-2 sm:mb-4 w-full text-center px-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
            {slides[currentIndex].title}
          </h2>
        </div>
      )}

      {/* Main Carousel */}
      <div className="relative mx-auto w-full">
        <div
          id="carousel-wrapper"
          className={cn(
            "relative w-full max-w-full",
            "md:max-w-2xl lg:max-w-4xl",
            "h-[300px] sm:h-[400px] md:h-[500px]",
            "overflow-hidden mx-auto rounded-md"
          )}
        >
          {/* Navigation Buttons - Always use relative positioning for better mobile UX */}
          <button
            className={cn(
              "z-50 absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2",
              "bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-full shadow-md",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              "border border-gray-200 dark:border-gray-700"
            )}
            onClick={previousSlide}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 dark:text-gray-300" />
          </button>

          {/* Slides */}
          <div
            className="flex z-10 transition-transform duration-500 ease-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={cn(
                  "flex-shrink-0 w-full relative",
                  "h-[300px] sm:h-[400px] md:h-[500px] ",
                  onSlideClick ? "cursor-pointer" : "cursor-default"
                )}
                onClick={() => onSlideClick?.(slide.id)}
              >
                <FallbackImage
                  src={slide.image}
                  alt={slide.title || slide.id}
                  layout="fill"
                  className="object-contain"
                  fallbackSrc="/empty-state/photos_empty.svg"
                />
              </div>
            ))}
          </div>

          <button
            className={cn(
              "z-50 absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2",
              "bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-full shadow-md",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              "border border-gray-200 dark:border-gray-700"
            )}
            onClick={nextSlide}
            disabled={currentIndex + 1 === slides.length}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {slides.length > 1 && (
        <div className="flex gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 px-2 pb-2 scrollbar-hide">
          {visibleThumbnails.map((_, index) => {
            const globalIndex = slides.indexOf(visibleThumbnails[index]);
            return (
              <button
                key={globalIndex}
                onClick={() => goToSlide(globalIndex)}
                className={cn(
                  "relative rounded-sm overflow-hidden transition-opacity flex-shrink-0",
                  "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12",
                  globalIndex === currentIndex
                    ? "ring-2 ring-teal-500 ring-offset-1 sm:ring-offset-2 opacity-100"
                    : "opacity-70 hover:opacity-100"
                )}
                aria-label={`Go to slide ${globalIndex + 1}`}
              >
                <FallbackImage
                  src={slides[globalIndex].image}
                  alt={`Thumbnail ${globalIndex + 1}`}
                  layout="fill"
                  className="rounded-sm object-cover"
                  fallbackSrc="/empty-state/photos_empty.svg"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
