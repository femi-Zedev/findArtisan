"use client";

import { Button, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useMemo } from "react";
import { FormArea, ButtonsArea } from "../shared";
import { RatingCriteriaRow } from "./RatingCriteriaRow";
import { WorkPhotosUpload } from "./WorkPhotosUpload";
import { ratingCriteria } from "@/constants";
import { useCreateReview } from "@/app/lib/services/review";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useDrawerContext } from "@/providers/drawer-provider";
import { api } from "@/app/lib/api-client";
import { routes } from "@/app/lib/routes";

interface RatingOption {
  label: string;
  points: number;
}

interface ArtisanFeedbackFormProps {
  artisanId: number;
  artisanName: string;
  onPrevious?: () => void;
  onSuccess?: () => void;
}

export function ArtisanFeedbackForm({
  artisanId,
  artisanName,
  onPrevious,
  onSuccess,
}: ArtisanFeedbackFormProps) {
  const [workPhotos, setWorkPhotos] = useState<File[]>([]);
  const { data: session } = useSession();
  const jwt = (session?.user as any)?.strapiJwt || "";
  const { closeDrawer } = useDrawerContext();

  // Initialize form with rating criteria
  const initialRatings: Record<string, RatingOption | null> = {};
  ratingCriteria.forEach((criterion) => {
    initialRatings[criterion.id] = null;
  });

  const form = useForm({
    initialValues: {
      ratings: initialRatings,
      comment: "",
    },
    validate: {
      ratings: (value) => {
        // Check if all criteria are rated
        const allRated = ratingCriteria.every(
          (criterion) => value[criterion.id] !== null
        );
        return allRated ? null : "Veuillez évaluer tous les critères";
      },
    },
  });

  // Calculate final score in real-time
  const finalScore = useMemo(() => {
    const ratings = form.values.ratings;
    const ratedCriteria = ratingCriteria.filter(
      (criterion) => ratings[criterion.id] !== null
    );

    if (ratedCriteria.length === 0) return null;

    const totalPoints = ratedCriteria.reduce((sum, criterion) => {
      const selected = ratings[criterion.id];
      return sum + (selected?.points || 0);
    }, 0);

    const average = totalPoints / ratedCriteria.length;
    return Math.round(average * 10) / 10; // Round to 1 decimal
  }, [form.values.ratings]);

  const createReviewMutation = useCreateReview({
    onSuccess: () => {
      notifications.show({
        title: "Succès",
        message: "Votre avis a été enregistré avec succès !",
        color: "teal",
      });
      form.reset();
      setWorkPhotos([]);
      closeDrawer();
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Erreur",
        message: error.message || "Une erreur est survenue lors de l'enregistrement de l'avis",
        color: "red",
      });
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // Upload work photos first
      let workPhotoIds: number[] = [];
      if (workPhotos.length > 0) {
        const uploadPromises = workPhotos.map((photo) =>
          api.uploadFile<Array<{ id: number }>>(
            routes.upload.base,
            photo,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          )
        );
        const uploadResults = await Promise.all(uploadPromises);
        workPhotoIds = uploadResults.map((result) => result[0]?.id).filter((id) => id !== undefined) as number[];
      }

      // Prepare rating criteria (points and label)
      const ratingCriteriaPoints: Record<string, { points: number; label: string }> = {};
      ratingCriteria.forEach((criterion) => {
        const selected = values.ratings[criterion.id];
        if (selected) {
          ratingCriteriaPoints[criterion.id] = {
            points: selected.points,
            label: selected.label,
          };
        }
      });

      // Create review
      await createReviewMutation.mutateAsync({
        payload: {
          artisan: artisanId,
          rating_criteria: ratingCriteriaPoints,
          final_score: finalScore!,
          comment: values.comment || undefined,
          work_photos: workPhotoIds.length > 0 ? workPhotoIds : undefined,
        },
        jwt,
      });
    } catch (error) {
      // Error is handled by onError callback
      console.error("Error creating review:", error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col h-full overflow-hidden">
      <FormArea className="gap-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-end justify-between gap-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Comment noteriez-vous le travail de {artisanName} ?
            </p>
            {finalScore !== null && (
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-300 ">
                Note global&nbsp;&nbsp;
                <strong className="text-2xl font-bold text-teal-600 dark:text-teal-400">{finalScore.toFixed(1)}</strong>
                /
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">10</span>
              </p>
            )}
          </div>
          <div className="w-full rounded-xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 py-2">
          {ratingCriteria.map((criterion) => (
            <>
            <RatingCriteriaRow
              key={criterion.id}
              criterion={criterion}
              selectedOption={form.values.ratings[criterion.id]}
              className="mx-2"
              onSelect={(option) => {
                form.setFieldValue(`ratings.${criterion.id}`, option);
              }}
            />
            <hr className="border-gray-200 dark:border-gray-700 last:hidden my-2" />
            </>
          ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <Textarea
            label="Commentaire"
            placeholder="Laissez un commentaire sur votre expérience avec cet artisan ...."
            size="md"
            minRows={4}
            classNames={{
              label: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
              input:
                "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
            }}
            {...form.getInputProps("comment")}
          />
        </div>

        {/* Work Photos */}
        <WorkPhotosUpload
          photos={workPhotos}
          onPhotosChange={setWorkPhotos}
          maxPhotos={5}
          maxSizeMB={5}
        />

        {form.errors.ratings && (
          <p className="text-sm text-red-500">{form.errors.ratings}</p>
        )}
      </FormArea>

      <ButtonsArea>
        <div className="flex gap-4 w-full justify-end">
          {/* {onPrevious && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onPrevious}
            >
              Retour
            </Button>
          )} */}
          <Button
            type="submit"
            size="md"
            loading={createReviewMutation.isPending}
            disabled={createReviewMutation.isPending || finalScore === null}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold"
          >
            {createReviewMutation.isPending ? "Enregistrement..." : "Terminer"}
          </Button>
        </div>
      </ButtonsArea>
    </form>
  );
}
