"use client";

import { Button, Autocomplete, TextInput, Textarea, Switch, FileInput, Select, MultiSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Plus, X, Upload, Minus } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { zones, professions } from "@/constants";
import { useState } from "react";

interface PhoneNumber {
  number: string;
  isWhatsApp: boolean;
}

interface SocialMedia {
  platform: string;
  link: string;
}

export interface AddArtisanFormValues {
  fullName: string;
  profession: string;
  zone: string[];
  phoneNumbers: PhoneNumber[];
  socialMedia: SocialMedia[];
  description?: string;
  photo?: File | null;
}

interface AddArtisanFormProps {
  onSuccess?: (values: AddArtisanFormValues) => void;
}

const socialPlatforms = [
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
];

export function AddArtisanForm({ onSuccess }: AddArtisanFormProps) {
  const [hasSocialMedia, setHasSocialMedia] = useState(false);

  const form = useForm<AddArtisanFormValues>({
    initialValues: {
      fullName: "",
      profession: "",
      zone: [],
      phoneNumbers: [{ number: "", isWhatsApp: false }],
      socialMedia: [],
      description: "",
      photo: null,
    },
    validate: {
      fullName: (value) => (!value ? "Le nom complet est requis" : null),
      profession: (value) => (!value ? "La profession est requise" : null),
      zone: (value) => (value.length === 0 ? "Au moins une zone est requise" : null),
      phoneNumbers: {
        number: (value, values) => {
          const hasValidPhone = values.phoneNumbers.some((p) => p.number.trim() !== "");
          return !hasValidPhone ? "Au moins un numéro de téléphone est requis" : null;
        },
      },
    },
  });

  const addPhoneNumber = () => {
    if (form.values.phoneNumbers.length < 4) {
      form.insertListItem("phoneNumbers", { number: "", isWhatsApp: false });
    }
  };

  const removePhoneNumber = (index: number) => {
    if (form.values.phoneNumbers.length > 1) {
      form.removeListItem("phoneNumbers", index);
    }
  };

  const toggleSocialMedia = (checked: boolean) => {
    setHasSocialMedia(checked);
    if (!checked) {
      form.setFieldValue("socialMedia", []);
    } else if (form.values.socialMedia.length === 0) {
      form.insertListItem("socialMedia", { platform: "", link: "" });
    }
  };

  const addSocialMedia = () => {
    form.insertListItem("socialMedia", { platform: "", link: "" });
  };

  const removeSocialMedia = (index: number) => {
    form.removeListItem("socialMedia", index);
    if (form.values.socialMedia.length === 1) {
      setHasSocialMedia(false);
    }
  };

  const handleSubmit = (values: AddArtisanFormValues) => {
    // TODO: Implement API call to submit artisan
    console.log("Add Artisan:", values);
    if (onSuccess) {
      onSuccess(values);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col h-full overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
        <div className="flex flex-col gap-6 pr-2">
          {/* Full Name */}
          <TextInput
            label="Nom complet"
            placeholder="Ex: Jean Dupont"
            size="lg"
            required
            classNames={{
              label: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
              input:
                "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
            }}
            {...form.getInputProps("fullName")}
          />

          {/* Profession and Zone - Same Line */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Autocomplete
              label="Profession"
              placeholder="Ex: Plombier"
              size="lg"
              data={professions}
              required
              classNames={{
                label: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
                input:
                  "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                dropdown:
                  "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
                option:
                  "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
              }}
              {...form.getInputProps("profession")}
            />
            <MultiSelect
              label="Zone"
              placeholder="Choisir une zone"
              size="lg"
              data={zones}
              searchable
              required
              classNames={{
                label: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
                input:
                  "rounded-lg border-gray-300 bg-white text-gray-900 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
                dropdown:
                  "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
                option:
                  "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
              }}
              {...form.getInputProps("zone")}
            />
          </div>

          {/* Phone Numbers */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Numéro de téléphone <span className="text-red-500">*</span>
            </label>
            {form.values.phoneNumbers.map((phone, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  placeholder="Ex: +229 01 96 09 69 69"
                  size="lg"
                  className="flex-1"
                  classNames={{
                    input:
                      "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                  }}
                  {...form.getInputProps(`phoneNumbers.${index}.number`)}
                />
                <div className="flex items-center gap-3">
                  <Switch
                    label="Numéro dispo sur WhatsApp ?"
                    size="md"
                    classNames={{
                      label: "text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap",
                      root: "flex items-center gap-2",
                    }}
                    {...form.getInputProps(`phoneNumbers.${index}.isWhatsApp`, {
                      type: "checkbox",
                    })}
                  />
                  {form.values.phoneNumbers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhoneNumber(index)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      )}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {form.values.phoneNumbers.length < 4 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftSection={<Plus size={16} />}
                onClick={addPhoneNumber}
                className="self-start border-teal-500 text-teal-500 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20"
              >
                Ajouter un autre numéro
              </Button>
            )}
            {form.errors.phoneNumbers && (
              <span className="text-xs text-red-500">{form.errors.phoneNumbers as string}</span>
            )}
          </div>

          {/* Social Media - Toggleable */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Réseaux sociaux (optionnel)
              </label>
              <Switch
                checked={hasSocialMedia}
                onChange={(e) => toggleSocialMedia(e.currentTarget.checked)}
                size="md"
                classNames={{
                  root: "flex items-center",
                }}
              />
            </div>
            {hasSocialMedia && (
              <div className="flex flex-col gap-4">
                {form.values.socialMedia.map((social, index) => (
                  <div key={index} className="flex gap-2">
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
                        "p-2 rounded-lg transition-colors flex items-center justify-center",
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

          {/* Description */}
          <Textarea
            label="Description (optionnel)"
            placeholder="Décrivez les services offerts par cet artisan..."
            size="lg"
            rows={4}
            classNames={{
              label: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
              input:
                "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
            }}
            {...form.getInputProps("description")}
          />

          {/* Photo Upload */}
          <FileInput
            label="Photo (optionnel)"
            placeholder="Télécharger une photo"
            accept="image/*"
            leftSection={<Upload size={16} />}
            size="lg"
            classNames={{
              label: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
              input:
                "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
            }}
            {...form.getInputProps("photo")}
          />
        </div>
      </div>

      {/* Fixed Submit Button */}
      <div className="shrink-0 p-6 mt-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          type="submit"
          size="lg"
          fullWidth
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold"
        >
          Ajouter l'artisan
        </Button>
      </div>
    </form>
  );
}

