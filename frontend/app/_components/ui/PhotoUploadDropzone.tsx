"use client";

import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Image, X } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface PhotoUploadDropzoneProps {
  photoPreview: string | null;
  onDrop: (files: File[]) => void;
  onRemove: (e: React.MouseEvent) => void;
  error?: string;
  showLabel?: boolean;
}

export function PhotoUploadDropzone({
  photoPreview,
  onDrop,
  onRemove,
  error,
  showLabel = true,
}: PhotoUploadDropzoneProps) {
  return (
    <div className="flex flex-col">
      {showLabel && (
        <label className="mantine-TextInput-label">
          Photo de l'artisan
        </label>
      )}
      <div className="relative group">
        <Dropzone
          onDrop={onDrop}
          accept={IMAGE_MIME_TYPE}
          multiple={false}
          classNames={{
            root: cn(
              "relative h-32 w-32 border-2 border-dashed rounded-3xl",
              "flex items-center justify-center cursor-pointer transition-all",
              "border-gray-300 dark:border-gray-600",
              "bg-gray-50 dark:bg-gray-800/50",
              "hover:border-teal-500 dark:hover:border-teal-500",
              "hover:bg-teal-50/50 dark:hover:bg-teal-900/10",
              photoPreview && " h-32 w-32 border-solid rounded-3xl"
            ),
            inner: "h-full w-full flex items-center justify-center p-0",
          }}
          styles={{
            root: {
              padding: 0,
            },
            inner: {
              height: "100%",
              width: "100%",
              padding: 0,
            },
          }}
        >
          {photoPreview ? (
            <>
              <img
                src={photoPreview}
                alt="Photo preview"
                className="w-full h-full rounded-3xl object-cover"
              />
              <button
                type="button"
                onClick={onRemove}
                className={cn(
                  "absolute inset-0 w-full h-full rounded-full z-10",
                  "flex items-center justify-center",
                  "bg-black/60 hover:bg-black/70 text-white",
                  "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                  "backdrop-blur-sm"
                )}
                aria-label="Supprimer la photo"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors cursor-pointer">
                    <X size={20} />
                  </div>
                  <span className="text-xs font-medium">Supprimer</span>
                </div>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 pointer-events-none">
              <Image className="w-8 h-8" />
              <span className="text-xs text-center px-2">Cliquez ou <br /> glissez-déposez</span>
            </div>
          )}
        </Dropzone>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

