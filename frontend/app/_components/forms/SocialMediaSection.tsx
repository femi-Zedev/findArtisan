"use client";

import { Button, Select, Switch, TextInput } from "@mantine/core";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { UseFormReturnType } from "@mantine/form";
import type { AddArtisanFormValues } from "@/app/lib/utils/artisan-form";

const socialPlatforms = [
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
];

interface SocialMediaSectionProps {
  form: UseFormReturnType<AddArtisanFormValues>;
  hasSocialMedia: boolean;
  onToggleSocialMedia: (checked: boolean) => void;
}

export function SocialMediaSection({
  form,
  hasSocialMedia,
  onToggleSocialMedia,
}: SocialMediaSectionProps) {
  const addSocialMedia = () => {
    form.insertListItem("socialMedia", { platform: "", link: "" });
  };

  const removeSocialMedia = (index: number) => {
    form.removeListItem("socialMedia", index);
    if (form.values.socialMedia.length === 1) {
      onToggleSocialMedia(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Switch
          label="Réseaux sociaux (optionnel)"
          checked={hasSocialMedia}
          onChange={(e) => onToggleSocialMedia(e.currentTarget.checked)}
          size="md"
          classNames={{
            root: "flex items-center",
          }}
        />
      </div>
      {hasSocialMedia && (
        <div className="flex flex-col gap-4">
          {form.values.socialMedia.map((social, index) => (
            <div key={index} className="flex gap-4">
              <Select
                placeholder="Plateforme"
                size="lg"
                data={socialPlatforms}
                className="flex-1"
                classNames={{
                  input:
                    "rounded-lg border-gray-300 bg-white text-gray-900 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
                  dropdown:
                    "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
                  option:
                    "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
                }}
                {...form.getInputProps(`socialMedia.${index}.platform`)}
              />
              <TextInput
                placeholder="https://..."
                size="lg"
                className="flex-1"
                classNames={{
                  input:
                    "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                }}
                {...form.getInputProps(`socialMedia.${index}.link`)}
              />
              <button
                type="button"
                onClick={() => removeSocialMedia(index)}
                className={cn(
                  "py-2 px-4 rounded-lg transition-colors flex items-center justify-center",
                  "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                )}
              >
                <Minus size={16} />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftSection={<Plus size={16} />}
            onClick={addSocialMedia}
            className="self-start border-teal-500 text-teal-500 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20"
          >
            Ajouter un autre réseau social
          </Button>
        </div>
      )}
    </div>
  );
}

