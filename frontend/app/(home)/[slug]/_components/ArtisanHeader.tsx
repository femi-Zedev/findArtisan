"use client";

import { Button, Badge, Tooltip } from "@mantine/core";
import { Phone, MessageCircle, MapPin, Calendar } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { Artisan } from "@/app/lib/services/artisan";
import { useMemo } from "react";

interface ArtisanHeaderProps {
  artisan: Artisan;
}

export function ArtisanHeader({ artisan }: ArtisanHeaderProps) {
  // Calculate average review score
  const reviewStats = useMemo(() => {
    if (!artisan.reviews || artisan.reviews.length === 0) {
      return null;
    }

    const totalScore = artisan.reviews.reduce((sum, review) => sum + review.finalScore, 0);
    const averageScore = totalScore / artisan.reviews.length;
    return {
      averageScore: Math.round(averageScore * 10) / 10,
      totalReviews: artisan.reviews.length,
    };
  }, [artisan.reviews]);

  // Get primary phone number (first WhatsApp or first phone)
  const primaryPhone = useMemo(() => {
    const whatsappPhone = artisan.phoneNumbers.find((p) => p.isWhatsApp);
    return whatsappPhone || artisan.phoneNumbers[0];
  }, [artisan.phoneNumbers]);

  // Format "Since" date
  const sinceDate = useMemo(() => {
    if (!artisan.createdAt) return null;
    const date = new Date(artisan.createdAt);
    const month = date.toLocaleDateString("fr-FR", { month: "long" });
    const year = date.getFullYear();
    return `Depuis ${month} ${year}`;
  }, [artisan.createdAt]);

  // Display zones (first 2-3 with +n tooltip)
  const displayedZones = artisan.zones.slice(0, 3);
  const remainingZones = artisan.zones.slice(3);

  const handleCall = () => {
    if (primaryPhone) {
      window.location.href = `tel:${primaryPhone.number}`;
    }
  };

  const handleWhatsApp = () => {
    if (primaryPhone && primaryPhone.isWhatsApp) {
      const message = encodeURIComponent(
        `Bonjour ${artisan.fullName}, je suis intéressé(e) par vos services.`
      );
      window.open(`https://wa.me/${primaryPhone.number}?text=${message}`, "_blank");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
      {/* Left side */}
      <div className="flex-1 min-w-0">
        {/* Artisan name */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {artisan.fullName}
        </h1>

        {/* Review score */}
        {reviewStats && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-300 inline-flex items-center gap-1">
              Note globale&nbsp;&nbsp;
              <strong className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {reviewStats.averageScore.toFixed(1)}
              </strong>
              /
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">10</span>
              &nbsp;&nbsp;({reviewStats.totalReviews} avis)
            </p>
          </div>
        )}

        {/* Locations */}
        {artisan.zones.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <div className="flex items-center gap-1 flex-wrap">
              {displayedZones.map((zone, idx) => (
                <span
                  key={zone.id}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {zone.name}
                  {idx < displayedZones.length - 1 && <span className="mx-1">,</span>}
                </span>
              ))}
              {remainingZones.length > 0 && (
                <Tooltip
                  label={
                    <div className="flex flex-col gap-1">
                      {remainingZones.map((zone) => (
                        <span key={zone.id}>{zone.name}</span>
                      ))}
                    </div>
                  }
                  position="top"
                  withArrow
                >
                  <span className="text-sm font-medium text-teal-600 dark:text-teal-400 cursor-help">
                    +{remainingZones.length}
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
        )}

        {/* Since date */}
        {sinceDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{sinceDate}</span>
          </div>
        )}
      </div>

      {/* Right side - Action buttons */}
      {primaryPhone && (
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <Button
            variant="outline"
            leftSection={<Phone className="h-4 w-4" />}
            onClick={handleCall}
            className={cn(
              "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
              "dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600"
            )}
          >
            Appeler
          </Button>
          {primaryPhone.isWhatsApp && (
            <Button
              leftSection={<MessageCircle className="h-4 w-4" />}
              onClick={handleWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              WhatsApp
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
