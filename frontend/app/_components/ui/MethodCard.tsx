"use client";

import { cn } from "@/app/lib/utils";

interface MethodCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
}

export function MethodCard({
  icon: Icon,
  title,
  description,
  onClick,
}: MethodCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-4 p-6 rounded-xl border-2",
        "border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-800",
        "hover:border-teal-500 dark:hover:border-teal-500",
        "hover:bg-teal-50/50 dark:hover:bg-teal-900/10",
        "transition-all cursor-pointer group",
      )}
      aria-label={`Sélectionner ${title}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
        <Icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </button>
  );
}

