"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";

interface FallbackImageProps {
  src: string;
  alt: string;
  layout?: "fill" | "responsive" | "intrinsic" | "fixed";
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
}

export default function FallbackImage({
  src,
  alt,
  layout = "fill",
  className,
  fallbackSrc = "/no-image.svg",
  width,
  height,
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  if (layout === "fill") {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        onError={handleError}
        // Remove unoptimized to let Next.js proxy images and bypass CORS
        // unoptimized
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn(className)}
      onError={handleError}
      // Remove unoptimized to let Next.js proxy images and bypass CORS
      // unoptimized
    />
  );
}
