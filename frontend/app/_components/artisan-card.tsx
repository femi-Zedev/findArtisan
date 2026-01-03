"use client";

import { Avatar, Button, Badge, Tooltip } from "@mantine/core";
import { Phone, MessageCircle, MapPin, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";
import { navRoutes } from "@/app/lib/navigation-routes";

interface ArtisanCardProps {
  name: string;
  profession: string;
  zone: string | string[];
  skills: string;
  phone: string;
  whatsapp?: boolean;
  imageUrl?: string;
  addedByCommunity?: boolean;
  layout?: "vertical" | "horizontal";
  slug: string;
}

export function ArtisanCard({
  name,
  profession,
  zone,
  skills,
  phone,
  whatsapp = true,
  imageUrl,
  addedByCommunity = false,
  layout = "vertical",
  slug,
}: ArtisanCardProps) {
  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(
      `Bonjour ${name}, je suis intéressé(e) par vos services.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  // Normalize zones to array
  const zones = Array.isArray(zone) ? zone : [zone];
  const displayedZones = zones.slice(0, 2);
  const remainingZones = zones.slice(2);

  // Parse skills from comma-separated string to array
  const skillsArray = skills
    ? skills.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
    : [];
  const displayedSkills = skillsArray.slice(0, 10);
  const remainingSkills = skillsArray.slice(10);

  // Horizontal Layout - shows vertical layout on mobile
  if (layout === "horizontal") {
    return (
      <>
        {/* Mobile: Vertical Layout */}
        <div className="sm:hidden">
          {(() => {
            // Render vertical layout for mobile
            return (
              <Link href={navRoutes.profile(slug)} className="block">
                <div
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-2xl border p-4 transition-all cursor-pointer",
                    "bg-white border-gray-200 hover:border hover:border-teal-500",
                    "dark:bg-gray-900 dark:border-gray-800 dark:hover:border-teal-500"
                  )}
                >
                {/* Top Section: Avatar + Name + Profession on left, Badge on right */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="shrink-0 ring-2 ring-teal-500/20 rounded-full">
                      <Avatar
                        src={imageUrl}
                        alt={name}
                        size={48}
                        radius="xl"
                        name={name}
                        color="initials"
                      >
                      </Avatar>
                    </div>

                    {/* Name and Profession */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {name}
                      </h3>
                      <Badge
                        variant="light"
                        className={cn(
                          "bg-gray-100 text-gray-700 border-gray-300 text-[10px] mt-1",
                          "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                        )}
                      >
                        {profession}
                      </Badge>
                    </div>
                  </div>


                </div>

                {/* Locations Block - Full width */}
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                  <MapPin className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div className="flex items-center gap-1 flex-wrap">
                    {displayedZones.map((z, idx) => (
                      <span key={idx} className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {z}
                        {idx < displayedZones.length - 1 && <span className="mx-1">,</span>}
                      </span>
                    ))}
                    {remainingZones.length > 0 && (
                      <Tooltip
                        label={
                          <div className="flex flex-col gap-1">
                            {remainingZones.map((z, idx) => (
                              <span key={idx}>{z}</span>
                            ))}
                          </div>
                        }
                        position="top"
                        withArrow
                      >
                        <span className="text-xs font-medium text-teal-600 dark:text-teal-400 cursor-help">
                          +{remainingZones.length}
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </div>

                {/* Skills Block - Full width */}
                {skillsArray.length > 0 && (
                  <div className="mb-3 flex-1">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                      Services & compétences
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {displayedSkills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"
                        >
                          <CheckCircle2 className="h-3 w-3 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>{skill}</span>
                        </div>
                      ))}
                      {remainingSkills.length > 0 && (
                        <Tooltip
                          label={
                            <div className="flex flex-col gap-1.5">
                              {remainingSkills.map((skill, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                  <CheckCircle2 className="h-3 w-3 text-purple-600 dark:text-purple-400 shrink-0" />
                                  <span>{skill}</span>
                                </div>
                              ))}
                            </div>
                          }
                          position="top"
                          withArrow
                        >
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 cursor-help">
                            +{remainingSkills.length}
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                )}

                {/* Community Badge - Right side */}
                {addedByCommunity && (
                  <div className="shrink-0 flex items-center gap-2  dark:bg-rose-900/30 bg-rose-100 rounded-md px-2 py-1.5 my-4 w-fit" >
                    <span className="flex items-center justify-center bg-rose-500 text-white rounded-full p-1">
                      <Users className="h-3 w-3" />
                    </span>
                    <p className="text-xs text-rose-700 dark:text-rose-300">ajouté par la communauté</p>

                  </div>
                )}

                {/* Action Buttons - Bottom */}
                <div className="flex gap-2 border-gray-200 dark:border-gray-800">
                  <Button
                    variant="outline"
                    leftSection={<Phone className="h-3.5 w-3.5" />}
                    onClick={handleCall}
                    size="sm"
                    className={cn(
                      "flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-xs",
                      "dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600"
                    )}
                  >
                    Appeler
                  </Button>
                  {whatsapp && (
                    <Button
                      leftSection={<MessageCircle className="h-3.5 w-3.5" />}
                      onClick={handleWhatsApp}
                      size="sm"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs"
                    >
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
              </Link>
            );
          })()}
        </div>

        {/* Desktop: Horizontal Layout */}
        <Link href={navRoutes.profile(slug)} className="block">
          <div
            className={cn(
              "hidden sm:flex group relative items-start gap-4 overflow-hidden rounded-xl border p-4 transition-all cursor-pointer",
              "bg-white border-gray-200 hover:border hover:border-teal-500",
              "dark:bg-gray-900 dark:border-gray-800 dark:hover:border-teal-500"
            )}
          >
          {/* Left: Avatar */}
          <div className="shrink-0 ring-2 ring-teal-500/20 rounded-full">
            <Avatar
              src={imageUrl}
              alt={name}
              size={48}
              radius="xl"
              name={name}
              color="initials"
            >
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
                          "flex gap-2 items-center justify-center rounded-md pl-2 pr-1 py-1 shrink-0",
                          "bg-rose-100 text-rose-700",
                          "text-xs",
                          "dark:bg-rose-900/30 dark:text-rose-400"
                        )}
                      >
                        <p>ajouté par la communauté</p>
                        <span className="flex items-center justify-center bg-rose-500 text-white rounded-full p-1">
                          <Users className="h-3 w-3" />
                        </span>
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
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {displayedZones.map((z, idx) => (
                      <span key={idx}>
                        {z}
                        {idx < displayedZones.length - 1 && <span className="mx-1">,</span>}
                      </span>
                    ))}
                    {remainingZones.length > 0 && (
                      <Tooltip
                        label={
                          <div className="flex flex-col gap-1">
                            {remainingZones.map((z, idx) => (
                              <span key={idx}>{z}</span>
                            ))}
                          </div>
                        }
                        position="top"
                        withArrow
                      >
                        <span className="text-teal-600 dark:text-teal-400 cursor-help">
                          +{remainingZones.length}
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {skillsArray.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Services & compétences
                </h4>
                <div className="flex flex-wrap gap-2">
                  {displayedSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                  {remainingSkills.length > 0 && (
                    <Tooltip
                      label={
                        <div className="flex flex-col gap-1.5">
                          {remainingSkills.map((skill, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                              <span>{skill}</span>
                            </div>
                          ))}
                        </div>
                      }
                      position="top"
                      withArrow
                    >
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400 cursor-help">
                        +{remainingSkills.length}
                      </span>
                    </Tooltip>
                  )}
                </div>
              </div>
            )}
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
        </Link>
      </>
    );
  }

  // Vertical Layout (default)
  return (
    <Link href={navRoutes.profile(slug)} className="block">
      <div
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl shadow-xl shadow-gray-300/20 dark:shadow-gray-700/20 border  p-6 transition-all cursor-pointer",
          "bg-white border-gray-300/60 hover:border hover:border-teal-500",
          "dark:bg-gray-900 dark:border-gray-800 dark:hover:border-teal-500"
        )}
      >
      {/* Top Section: Avatar + Name + Profession on left, Badge on right */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar */}
         
            <Avatar
              src={imageUrl}
              alt={name}
              size={52}
              radius="xl"
              name={name}
              color="initials"
            >
            </Avatar>

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
        <div className="flex items-center gap-1 flex-wrap">
          {displayedZones.map((z, idx) => (
            <span key={idx} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {z}
              {idx < displayedZones.length - 1 && <span className="mx-1">,</span>}
            </span>
          ))}
          {remainingZones.length > 0 && (
            <Tooltip
              label={
                <div className="flex flex-col gap-1">
                  {remainingZones.map((z, idx) => (
                    <span key={idx}>{z}</span>
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

      {/* Skills Block - Full width */}
      {skillsArray.length > 0 && (
        <div className="mb-5 flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Services & compétences
          </h4>
          <div className="flex flex-wrap gap-2">
            {displayedSkills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
            {remainingSkills.length > 0 && (
              <Tooltip
                label={
                  <div className="flex flex-col gap-1.5">
                    {remainingSkills.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                }
                position="top"
                withArrow
              >
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400 cursor-help">
                  +{remainingSkills.length}
                </span>
              </Tooltip>
            )}
          </div>
        </div>
      )}

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
    </Link>
  );
}
