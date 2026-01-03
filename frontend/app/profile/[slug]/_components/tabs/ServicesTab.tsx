"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { Artisan } from "@/app/lib/services/artisan";
import { suggestedSkills } from "@/constants";

interface ServicesTabProps {
  artisan: Artisan;
}

interface GroupedSkill {
  group: string;
  skills: string[];
  count: number;
}

export function ServicesTab({ artisan }: ServicesTabProps) {
  // Parse skills from comma-separated string
  const skillsArray = artisan.skills
    ? artisan.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    : [];

  // Group skills by categories from suggestedSkills
  const groupedSkills = useMemo(() => {
    if (skillsArray.length === 0) return [];

    const groups: GroupedSkill[] = [];
    const matchedSkills = new Set<string>();

    // Match skills to groups
    suggestedSkills.forEach((skillGroup) => {
      const matched: string[] = [];
      
      skillsArray.forEach((skill) => {
        const normalizedSkill = skill.toLowerCase().trim();
        const isMatch = skillGroup.items.some(
          (item) => item.toLowerCase().trim() === normalizedSkill
        );
        
        if (isMatch) {
          matched.push(skill);
          matchedSkills.add(skill);
        }
      });

      if (matched.length > 0) {
        groups.push({
          group: skillGroup.group,
          skills: matched,
          count: matched.length,
        });
      }
    });

    // Add unmatched skills to "Autres" group
    const unmatched = skillsArray.filter((skill) => !matchedSkills.has(skill));
    if (unmatched.length > 0) {
      groups.push({
        group: "Autres compétences",
        skills: unmatched,
        count: unmatched.length,
      });
    }

    // Sort by count (descending), then alphabetically
    return groups.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.group.localeCompare(b.group);
    });
  }, [skillsArray]);

  // Accordion state management
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(groupedSkills.map((g) => g.group))
  );

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  if (skillsArray.length === 0) {
    return (
      <div className="text-center py-8">
        <img src="/empty-state/card_empty.svg" alt="No skills" width={100} />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Aucune compétence spécifiée pour cet artisan.
        </p>
      </div>
    );
  }

  if (groupedSkills.length === 0) {
    return (
      <div className="text-center py-8">
        <img src="/empty-state/card_empty.svg" alt="No skills" width={100} />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Aucune compétence spécifiée pour cet artisan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedSkills.map((group) => {
        const isOpen = openGroups.has(group.group);
        
        return (
          <div
            key={group.group}
            className={cn(
              "rounded-xl border transition-all duration-300 ease-in-out",
              "bg-white dark:bg-gray-800",
              "border-gray-200 dark:border-gray-700",
              isOpen && "border-teal-500 dark:border-teal-500"
            )}
          >
            <button
              onClick={() => toggleGroup(group.group)}
              className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200"
            >
              <span className="font-semibold text-gray-900 dark:text-white flex-1">
                {group.group} ({group.count})
              </span>
              <div
                className={cn(
                  "shrink-0 transition-transform duration-300 ease-in-out",
                  isOpen && "rotate-180"
                )}
              >
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isOpen
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                />
              </div>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="px-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                  {group.skills.map((skill, idx) => (
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
