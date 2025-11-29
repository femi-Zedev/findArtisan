"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface TableHeaderProps {
  title: string;
  rightSection?: React.ReactNode;
  dataCount?: number;
  className?: string;
}

export function TableHeader({
  title,
  rightSection,
  dataCount,
  className,
}: TableHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 border border-gray-200 dark:border-gray-800 border-b-0 rounded-t-xl",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-fit">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {dataCount !== undefined && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({dataCount})
          </span>
        )}
      </div>
      {rightSection && (
        <div className="flex items-center gap-2 w-full">
          {rightSection}
        </div>
      )}
    </div>
  );
}

