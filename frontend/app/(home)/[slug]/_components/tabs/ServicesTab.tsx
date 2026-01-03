"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { Artisan } from "@/app/lib/services/artisan";

interface ServicesTabProps {
  artisan: Artisan;
}

export function ServicesTab({ artisan }: ServicesTabProps) {
  // Parse skills from comma-separated string
  const skillsArray = artisan.skills
    ? artisan.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  if (skillsArray.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Aucune compétence spécifiée pour cet artisan.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
        Services & compétences
      </h3>
      <div className="flex flex-wrap gap-2">
        {skillsArray.map((skill, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
