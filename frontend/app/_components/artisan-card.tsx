"use client";

import { Avatar, Button, Badge, Tooltip } from "@mantine/core";
import { Phone, MessageCircle, MapPin, Users } from "lucide-react";
import { cn } from "../lib/utils";

interface ArtisanCardProps {
  name: string;
  profession: string;
  zone: string;
  description: string;
  phone: string;
  whatsapp?: boolean;
  imageUrl?: string;
  addedByCommunity?: boolean;
  layout?: "vertical" | "horizontal";
}

export function ArtisanCard({
  name,
  profession,
  zone,
  description,
  phone,
  whatsapp = true,
  imageUrl,
  addedByCommunity = false,
  layout = "vertical",
}: ArtisanCardProps) {
  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour ${name}, je suis intéressé(e) par vos services.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  // Horizontal Layout
  if (layout === "horizontal") {
    return (
      <div
        className={cn(
          "group relative flex items-center gap-4 overflow-hidden rounded-xl border p-4 transition-all",
          "bg-white border-gray-200 hover:border hover:border-teal-500",
          "dark:bg-gray-900 dark:border-gray-800 dark:hover:border-teal-500"
        )}
      >
        {/* Left: Avatar */}
        <div className="shrink-0 ring-2 ring-teal-500/20 rounded-full">
          <Avatar
            src={imageUrl}
            alt={name}
            size={64}
            radius="xl"
            color="teal"
            className="border-2 border-teal-500"
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
        </div>

        {/* Middle: Name, Profession, Zone, Description */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                  {name}
                </h3>
                {addedByCommunity && (
                  <Tooltip label="Ajouté par la communauté" position="top" withArrow>
                    <div
                      className={cn(
                        "flex items-center justify-center h-5 w-5 rounded-full shrink-0",
                        "bg-rose-100 text-rose-700",
                        "dark:bg-rose-900/30 dark:text-rose-400"
                      )}
                    >
                      <Users className="h-3 w-3" />
                    </div>
                  </Tooltip>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="light"
                  className={cn(
                    "bg-gray-100 text-gray-700 border-gray-300 text-xs",
                    "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  )}
                >
                  {profession}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{zone}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Right: Action Buttons */}
        <div className="shrink-0 flex flex-col gap-2">
          {whatsapp && (
            <Button
              leftSection={<MessageCircle className="h-4 w-4" />}
              onClick={handleWhatsApp}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap"
            >
              WhatsApp
            </Button>
          )}
          <Button
            variant="outline"
            leftSection={<Phone className="h-4 w-4" />}
            onClick={handleCall}
            size="sm"
            className={cn(
              "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 whitespace-nowrap",
              "dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600"
            )}
          >
            Appeler
          </Button>
        </div>
      </div>
    );
  }

  // Vertical Layout (default)
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all",
        "bg-white border-gray-200 hover:border hover:border-teal-500",
        "dark:bg-gray-900 dark:border-gray-800 dark:hover:border-teal-500"
      )}
    >
      {/* Top Section: Avatar + Name + Profession on left, Badge on right */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="shrink-0 ring-2 ring-teal-500/20 rounded-full">
            <Avatar
              src={imageUrl}
              alt={name}
              size={52}
              radius="xl"
              color="teal"
              className="border-2 border-teal-500"
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
          </div>

          {/* Name and Profession */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
              {name}
            </h3>
            <Badge
              variant="light"
              className={cn(
                "bg-gray-100 text-gray-700 border-gray-300 text-xs",
                "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
              )}
            >
              {profession}
            </Badge>
          </div>
        </div>

        {/* Community Badge - Right side */}
        {addedByCommunity && (
          <div className="shrink-0">
            <Tooltip label="Ajouté par la communauté" position="top" withArrow>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center h-6 w-6 rounded-full",
                  "bg-rose-100 text-rose-700 hover:bg-rose-200",
                  "dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50",
                  "transition-colors cursor-pointer"
                )}
                aria-label="Ajouté par la communauté"
              >
                <Users className="h-3 w-3" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Locations Block - Full width */}
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
        <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {zone}
        </span>
      </div>

      {/* Description Block - Full width */}
      <div className="mb-5 flex-1">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Action Buttons - Bottom */}
      <div className="flex gap-2 border-gray-200 dark:border-gray-800">
        <Button
          variant="outline"
          leftSection={<Phone className="h-4 w-4" />}
          onClick={handleCall}
          className={cn(
            "flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
            "dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600"
          )}
        >
          Appeler
        </Button>
        {whatsapp && (
          <Button
            leftSection={<MessageCircle className="h-4 w-4" />}
            onClick={handleWhatsApp}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
}
