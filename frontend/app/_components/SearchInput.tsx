"use client";

import { TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  className,
  size = "md",
}: SearchInputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      leftSection={<Search className="h-4 w-4 text-gray-400" />}
      size={size}
      className={cn("w-full max-w-md", className)}
      classNames={{
        input:
          "rounded-xl border-gray-300 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",

      }}
    />
  );
}

