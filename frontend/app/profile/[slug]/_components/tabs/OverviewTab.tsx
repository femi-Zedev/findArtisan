"use client";

import { Badge, Button } from "@mantine/core";
import { Phone, MessageCircle, MapPin, Users, ExternalLink } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { Artisan } from "@/app/lib/services/artisan";

interface OverviewTabProps {
  artisan: Artisan;
}

export function OverviewTab({ artisan }: OverviewTabProps) {
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = (phoneNumber: string) => {
    const message = encodeURIComponent(
      `Bonjour ${artisan.fullName}, je suis intéressé(e) par vos services.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Profession */}
      {artisan.profession && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Profession
          </h3>
          <Badge
            variant="light"
            className={cn(
              "bg-gray-100 text-gray-700 border-gray-300",
              "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            )}
          >
            {artisan.profession.name}
          </Badge>
        </div>
      )}

      {/* Zones */}
      {artisan.zones.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Zones couvertes
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
            {artisan.zones.map((zone, idx) => (
              <span
                key={zone.id}
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                {zone.name}
                {idx < artisan.zones.length - 1 && <span className="mx-1">,</span>}
              </span>
            ))}
          </div>
        </div>
      )}


      {/* Social media links */}
      {artisan.socialLinks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Réseaux sociaux
          </h3>
          <div className="flex flex-wrap gap-2">
            {artisan.socialLinks.map((social) => (
              <Button
                key={social.id}
                variant="outline"
                size="sm"
                leftSection={<ExternalLink className="h-4 w-4" />}
                component="a"
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "border-gray-300 text-gray-700 hover:bg-gray-50",
                  "dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                {social.platform}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Community badge */}
      {artisan.isCommunitySubmitted && (
        <div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 w-fit",
              "bg-rose-100 text-rose-700",
              "dark:bg-rose-900/30 dark:text-rose-400"
            )}
          >
            <span className="flex items-center justify-center bg-rose-500 text-white rounded-full p-1">
              <Users className="h-3 w-3" />
            </span>
            <p className="text-xs">ajouté par la communauté</p>
          </div>
        </div>
      )}
    </div>
  );
}
