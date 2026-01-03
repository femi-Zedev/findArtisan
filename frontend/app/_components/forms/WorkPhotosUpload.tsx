"use client";

import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Image, X, Upload } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useState, useCallback } from "react";

interface WorkPhotosUploadProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  maxPhotos?: number;
  maxSizeMB?: number;
}

export function WorkPhotosUpload({
  photos,
  onPhotosChange,
  maxPhotos = 5,
  maxSizeMB = 5,
}: WorkPhotosUploadProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    // Check file size (5MB max)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `L'image "${file.name}" dépasse la taille maximale de ${maxSizeMB}MB`;
    }
    return null;
  };

  const handleDrop = useCallback(
    (files: File[]) => {
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      // Check total count
      const remainingSlots = maxPhotos - photos.length;
      if (files.length > remainingSlots) {
        newErrors.push(`Vous ne pouvez ajouter que ${remainingSlots} photo(s) supplémentaire(s)`);
      }

      // Validate each file
      files.slice(0, remainingSlots).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      setErrors(newErrors);
      if (validFiles.length > 0) {
        onPhotosChange([...photos, ...validFiles]);
      }
    },
    [photos, maxPhotos, onPhotosChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newPhotos = photos.filter((_, i) => i !== index);
      onPhotosChange(newPhotos);
      setErrors([]);
    },
    [photos, onPhotosChange]
  );

  const remainingSlots = maxPhotos - photos.length;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex gap-2 items-center">
          Ajoutez des images de la prestation
          <p className="text-xs text-gray-500 dark:text-gray-400">
          (jusqu'à {maxPhotos} photos max {maxSizeMB}MB par image)
        </p>
        </span>
        

        {photos.length < maxPhotos && (
          <Dropzone
            onDrop={handleDrop}
            accept={IMAGE_MIME_TYPE}
            multiple={true}
            maxSize={maxSizeMB * 1024 * 1024}
            classNames={{
              root: cn(
                "border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer",
                "border-gray-300 dark:border-gray-600",
                "bg-gray-50 dark:bg-gray-800/50",
                "hover:border-teal-500 dark:hover:border-teal-500",
                "hover:bg-teal-50/50 dark:hover:bg-teal-900/10"
              ),
            }}
          >
            <div className="flex items-center justify-between gap-3 text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-2">
                <Image className="w-8 h-8" />
              <div className="">
                <p className="text-sm font-medium">Cliquez ou glissez-déposez</p>
                <p className="text-xs ">pour ajouter des photos</p>
              </div>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Sélectionner fichiers
              </button>
            </div>
          </Dropzone>
        )}

        {errors.length > 0 && (
          <div className="mt-2 space-y-1">
            {errors.map((error, index) => (
              <p key={index} className="text-xs text-red-500">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <img
                src={URL.createObjectURL(photo)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className={cn(
                  "absolute inset-0 w-full h-full flex items-center justify-center rounded-lg",
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
