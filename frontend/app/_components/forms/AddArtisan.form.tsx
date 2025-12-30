"use client";

import { Button, Autocomplete, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useCallback } from "react";
import { MultiSelectCompact } from "../ui/MultiSelectCompact";
import { PhotoUploadDropzone } from "../ui/PhotoUploadDropzone";
import { PhoneNumbersSection } from "./PhoneNumbersSection";
import { SocialMediaSection } from "./SocialMediaSection";
import { useCreateArtisan, useUpdateArtisan, type Artisan, artisanKeys } from "@/app/lib/services/artisan";
import { notifications } from "@mantine/notifications";
import { useUserStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { professions, zones } from "@/constants";
import {
  type AddArtisanFormValues,
  validatePhoneNumber,
  transformFormValuesToPayload,
  getInitialFormValues,
} from "@/app/lib/utils/artisan-form";

interface AddArtisanFormProps {
  artisan?: Artisan;
  onSuccess?: () => void;
}

export function AddArtisanForm({ artisan, onSuccess }: AddArtisanFormProps) {
  const isEditMode = !!artisan;
  const [hasSocialMedia, setHasSocialMedia] = useState<boolean>(
    !!(artisan?.socialLinks && artisan.socialLinks.length > 0)
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    artisan?.profilePhoto?.url || null
  );

  const initialValues = getInitialFormValues(artisan);

  const form = useForm<AddArtisanFormValues>({
    initialValues,
    validate: {
      fullName: (value) => (!value ? "Le nom complet est requis" : null),
      profession: (value) => (!value ? "La profession est requise" : null),
      zone: (value) => (value.length === 0 ? "Au moins une zone est requise" : null),
      phoneNumbers: {
        number: (value, values, path) => {
          const currentIndex = parseInt(path.split('.')[1]);
          return validatePhoneNumber(value, values.phoneNumbers, currentIndex);
        },
      },
    },
  });

  const toggleSocialMedia = (checked: boolean) => {
    setHasSocialMedia(checked);
    if (!checked) {
      form.setFieldValue("socialMedia", []);
    } else if (form.values.socialMedia.length === 0) {
      form.insertListItem("socialMedia", { platform: "", link: "" });
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

  const { isAdmin } = useUserStore();
  const { data: session } = useSession();
  const jwt = (session?.user as any)?.strapiJwt || '';
  const queryClient = useQueryClient();

  const createArtisanMutation = useCreateArtisan({
    onSuccess: () => {
      notifications.show({
        title: "Succès",
        message: "L'artisan a été ajouté avec succès !",
        color: "teal",
      });
      // Reset form
      form.reset();
      setPhotoPreview(null);
      setHasSocialMedia(false);
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Erreur",
        message: error.message || "Une erreur est survenue lors de l'ajout de l'artisan",
        color: "red",
      });
    },
  });

  const updateArtisanMutation = useUpdateArtisan({
    onSuccess: () => {
      notifications.show({
        title: "Succès",
        message: "L'artisan a été modifié avec succès !",
        color: "teal",
      });
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: artisanKeys.searches() });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Erreur",
        message: error.message || "Une erreur est survenue lors de la modification de l'artisan",
        color: "red",
      });
    },
  });

  const handleSubmit = async (values: AddArtisanFormValues) => {
    try {
      const payload = transformFormValuesToPayload(
        values,
        isEditMode,
        isAdmin,
        artisan
      );

      if (isEditMode && artisan) {
        await updateArtisanMutation.mutateAsync({
          id: artisan.id,
          payload,
          jwt,
        });
      } else {
        await createArtisanMutation.mutateAsync({
          payload,
          jwt,
        });
      }
    } catch (error) {
      // Error is handled by onError callback
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} artisan:`, error);
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
            placeholder="Ex: Dodji COMLAN "
            description="(Prénoms Nom) L'ordre est important !"
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
              label="Domaine"
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
          <PhoneNumbersSection form={form} />

          {/* Social Media - Toggleable */}
          <SocialMediaSection
            form={form}
            hasSocialMedia={hasSocialMedia}
            onToggleSocialMedia={toggleSocialMedia}
          />
        </div>
      </div>

      {/* Fixed Submit Button */}
      <div className="shrink-0 mt-4">
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={createArtisanMutation.isPending || updateArtisanMutation.isPending}
          disabled={createArtisanMutation.isPending || updateArtisanMutation.isPending}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold"
        >
          {createArtisanMutation.isPending || updateArtisanMutation.isPending
            ? (isEditMode ? "Modification en cours..." : "Ajout en cours...")
            : (isEditMode ? "Modifier l'artisan" : "Ajouter l'artisan")}
        </Button>
      </div>
    </form>
  );
}

