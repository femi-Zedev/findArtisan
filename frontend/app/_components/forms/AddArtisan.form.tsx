"use client";

import { Button, Autocomplete, TextInput, Textarea, Switch, Select, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { Plus, X, Minus, Image } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { zones, professions } from "@/constants";
import { useState, useCallback } from "react";
import { MultiSelectCompact } from "../ui/MultiSelectCompact";
import { PhoneInput } from "../ui/PhoneInput";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import type { Artisan } from "@/app/lib/services/artisan";

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
  artisan?: Artisan;
}

const socialPlatforms = [
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
];

interface PhotoUploadDropzoneProps {
  photoPreview: string | null;
  onDrop: (files: File[]) => void;
  onRemove: (e: React.MouseEvent) => void;
  error?: string;
  showLabel?: boolean;
}

function PhotoUploadDropzone({
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
          Photo de profil (optionnel)
        </label>
      )}
      <div className="relative">
        <Dropzone
          onDrop={onDrop}
          accept={IMAGE_MIME_TYPE}
          multiple={false}
          classNames={{
            root: cn(
              "relative h-32 w-42 rounded-3xl border-2 border-dashed",
              "flex items-center justify-center cursor-pointer transition-all",
              "border-gray-300 dark:border-gray-600",
              "bg-gray-50 dark:bg-gray-800/50",
              "hover:border-teal-500 dark:hover:border-teal-500",
              "hover:bg-teal-50/50 dark:hover:bg-teal-900/10",
              photoPreview && "w-42 h-42 border-solid !rounded-full "
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
                className="w-full h-full rounded-2xl object-cover"
              />
              <button
                type="button"
                onClick={onRemove}
                className={cn(
                  "absolute -top-1 -right-1 w-8 h-8 rounded-full z-10",
                  "flex items-center justify-center",
                  "bg-red-500 hover:bg-red-600 text-white",
                  "shadow-lg transition-colors"
                )}
                aria-label="Supprimer la photo"
              >
                <X size={14} />
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

export function AddArtisanForm({ onSuccess, artisan }: AddArtisanFormProps) {
  const [hasSocialMedia, setHasSocialMedia] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const initialValues: AddArtisanFormValues = artisan
    ? {
        fullName: artisan.fullName ?? "",
        profession: artisan.profession?.name ?? "",
        zone: artisan.zones?.map((z) => z.name) ?? [],
        phoneNumbers:
          artisan.phoneNumbers && artisan.phoneNumbers.length > 0
            ? artisan.phoneNumbers.map((p) => ({
                number: p.number,
                isWhatsApp: p.isWhatsApp,
              }))
            : [{ number: "", isWhatsApp: false }],
        socialMedia:
          artisan.socialLinks?.map((s) => ({
            platform: s.platform,
            link: s.link,
          })) ?? [],
        description: artisan.description ?? "",
        photo: null,
      }
    : {
        fullName: "",
        profession: "",
        zone: [],
        phoneNumbers: [{ number: "", isWhatsApp: false }],
        socialMedia: [],
        description: "",
        photo: null,
      };

  const form = useForm<AddArtisanFormValues>({
    initialValues,
    validate: {
      fullName: (value) => (!value ? "Le nom complet est requis" : null),
      profession: (value) => (!value ? "La profession est requise" : null),
      zone: (value) => (value.length === 0 ? "Au moins une zone est requise" : null),
      phoneNumbers: {
        number: (value, values, path) => {
          // Skip validation if field is empty
          if (!value || value.trim() === "") {
            const hasOtherValidPhone = values.phoneNumbers.some((p, idx) => {
              const currentIndex = parseInt(path.split('.')[1]);
              return idx !== currentIndex && p.number.trim() !== "";
            });
            return hasOtherValidPhone ? null : "Au moins un numéro de téléphone est requis";
          }
          
          try {
            // Check if the number is valid
            if (!isValidPhoneNumber(value)) {
              return 'Numéro de téléphone invalide';
            }
            
            return null;
          } catch {
            return 'Numéro de téléphone invalide';
          }
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

  const handlePhotoChange = useCallback((file: File | null) => {
    form.setFieldValue("photo", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  }, [form]);

  const handlePhotoRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    form.setFieldValue("photo", null);
    setPhotoPreview(null);
  }, [form]);

  const handleDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      handlePhotoChange(file);
    }
  }, [handlePhotoChange]);

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
      <div className="flex-1 overflow-y-visible overflow-x-hidden px-2 py-4">
        <div className="flex flex-col gap-6 pr-2">
          {/* Photo and Description - Inline */}
          <div className="grid grid-cols-1 md:grid-cols-[208px_1fr] gap-6 items-start">
            {/* Photo Upload */}
            <PhotoUploadDropzone
              photoPreview={photoPreview}
              onDrop={handleDrop}
              onRemove={handlePhotoRemove}
              error={form.errors.photo as string | undefined}
              showLabel={true}
            />

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Décrivez les services offerts par cet artisan..."
              size="lg"
              maxLength={1000}
              required
              classNames={{
                label: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
                input:
                  "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
              }}
              {...form.getInputProps("description")}
            />
          </div>

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
            <MultiSelectCompact
              label="Zone"
              placeholder="Choisir une ou plusieurs zones"
              data={zones}
              value={form.values.zone}
              onChange={(value) => form.setFieldValue("zone", value)}
              searchable
              required
              error={form.errors.zone as string | undefined}
              classNames={{
                label: "text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2",
                input:
                  "border-gray-300 bg-white text-gray-900 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
                dropdown:
                  "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
                option:
                  "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
              }}
            />
          </div>

          {/* Phone Numbers */}
          <div className="flex flex-col gap-4">

            {form.values.phoneNumbers.map((phone, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                <PhoneInput
                  label="Numéro de téléphone"
                  placeholder="96 09 69 69"
                  required
                  className="flex-1"
                  value={form.values.phoneNumbers[index].number}
                  onChange={(value) => form.setFieldValue(`phoneNumbers.${index}.number`, value || '')}
                  error={form.errors[`phoneNumbers.${index}.number`] as string | undefined}
                />
                <div className="flex items-center gap-3 mt-8">
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

              <Switch
                label="Réseaux sociaux (optionnel)"
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
        </div>
      </div>

      {/* Fixed Submit Button */}
      <div className="shrink-0 mt-4">
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

