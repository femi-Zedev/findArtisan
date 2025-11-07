"use client";

import { useState, useCallback } from "react";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface FileUploadAreaProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
  error: string | null;
  label?: string;
  accept?: string;
  maxSize?: number;
  maxSizeLabel?: string;
}

export function FileUploadArea({
  onFileSelect,
  file,
  error,
  label = "Uploader votre fichier",
  accept = ".csv",
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxSizeLabel,
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (selectedFile: File) => {
      // Validation is handled in parent component
      onFileSelect(selectedFile);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileChange(droppedFile);
      }
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const displayMaxSize = maxSizeLabel || `${(maxSize / 1024 / 1024).toFixed(0)}MB`;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed transition-colors",
          isDragging
            ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
            : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50",
          "hover:border-teal-500 dark:hover:border-teal-500",
          "hover:bg-teal-50/50 dark:hover:bg-teal-900/10",
          "cursor-pointer"
        )}
      >
        <Upload
          className={cn(
            "h-8 w-8 transition-colors",
            isDragging ? "text-teal-500" : "text-gray-400 dark:text-gray-500"
          )}
        />
        <div className="text-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isDragging
              ? "Déposez le fichier ici"
              : "Cliquez pour uploader ou glissez-déposez"}
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {accept && `Fichier ${accept.toUpperCase()} uniquement`} (max {displayMaxSize})
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              handleFileChange(selectedFile);
            }
          }}
        />
      </label>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
          <span className="text-sm text-red-800 dark:text-red-200 flex-1">
            {error}
          </span>
        </div>
      )}

      {file && !error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 truncate">
              {file.name}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }}
            className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            aria-label="Supprimer le fichier"
          >
            <X className="h-4 w-4 text-green-600 dark:text-green-400" />
          </button>
        </div>
      )}
    </div>
  );
}

