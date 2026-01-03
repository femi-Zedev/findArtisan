"use client";

import { useState, useCallback, useEffect } from "react";
import Carousel, { type SlideItem } from "./Carousel";

interface CarouselModalContentProps {
  slides: SlideItem[];
  initialIndex: number;
  onIndexChange: (index: number) => void;
}

export function CarouselModalContent({
  slides,
  initialIndex,
  onIndexChange,
}: CarouselModalContentProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleSlideChange = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
  }, [onIndexChange]);

  const handleSlideClick = useCallback((slideId: string) => {
    const clickedIndex = slides.findIndex((slide) => slide.id === slideId);
    if (clickedIndex !== -1) {
      setCurrentIndex(clickedIndex);
      onIndexChange(clickedIndex);
    }
  }, [slides, onIndexChange]);

  // Update currentIndex when initialIndex changes (e.g., when clicking grid photo)
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  return (
    <Carousel
      slides={slides}
      currentIndex={currentIndex}
      onSlideChange={handleSlideChange}
      onSlideClick={handleSlideClick}
      buttonPosition="relative"
    />
  );
}
