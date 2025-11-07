"use client";

import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = "Retour au choix" }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mb-4 cursor-pointer text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-2 transition-colors"
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}

