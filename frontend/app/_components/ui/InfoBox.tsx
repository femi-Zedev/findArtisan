"use client";

import { Info } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface InfoBoxProps {
  title?: string;
  children: React.ReactNode;
  variant?: "blue" | "teal";
}

export function InfoBox({ title, children, variant = "blue" }: InfoBoxProps) {
  const variantClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200",
    teal: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200",
  };

  return (
    <div className={cn("rounded-lg border p-4", variantClasses[variant])}>
      <div className="flex items-start gap-3">
        <Info
          className={cn(
            "h-5 w-5 shrink-0 mt-0.5",
            variant === "blue"
              ? "text-blue-600 dark:text-blue-400"
              : "text-teal-600 dark:text-teal-400"
          )}
        />
        <div className="flex-1">
          {title && (
            <p
              className={cn(
                "text-sm font-medium mb-2",
                variant === "blue"
                  ? "text-blue-900 dark:text-blue-200"
                  : "text-teal-900 dark:text-teal-200"
              )}
            >
              {title}
            </p>
          )}
          <div
            className={cn(
              "text-sm",
              variant === "blue"
                ? "text-blue-800 dark:text-blue-300"
                : "text-teal-800 dark:text-teal-300"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

