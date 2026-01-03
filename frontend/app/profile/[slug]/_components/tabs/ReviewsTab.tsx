"use client";

import { useState, useCallback, useMemo } from "react";
import { Badge, Skeleton, Avatar, Button, Tooltip } from "@mantine/core";
import { useGetReviews } from "@/app/lib/services/review";
import { ratingCriteria } from "@/constants";
import { cn } from "@/app/lib/utils";
import type { Artisan } from "@/app/lib/services/artisan";
import { MessageSquarePlus } from "lucide-react";
import { useModalContext } from "@/providers/modal-provider";
import { CarouselModalContent, type SlideItem } from "@/app/_components/ui";

interface ReviewsTabProps {
  artisan: Artisan;
}

export function ReviewsTab({ artisan }: ReviewsTabProps) {
  const { data: reviewsData, isLoading } = useGetReviews({variables: {artisan: artisan.id}});
  const { openModal } = useModalContext();
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);

  const reviews = reviewsData?.data || [];
  const aggregateStats = reviewsData?.meta?.aggregate;

  // Collect all work photos from all reviews and convert to carousel slides format
  const carouselSlides: SlideItem[] = useMemo(() => 
    (artisan.reviews || [])
      .flatMap((review) => review.workPhotos || [])
      .map((photo) => ({
        id: String(photo.id),
        image: photo.url,
        title: photo.alternativeText || "Photo du travail",
      })),
    [artisan.reviews]
  );

  // Calculate stats from artisan.reviews if available (fallback)
  const localStats = useMemo(() => {
    if (artisan.reviews && artisan.reviews.length > 0) {
      const totalScore = artisan.reviews.reduce((sum, review) => sum + review.finalScore, 0);
      const averageScore = totalScore / artisan.reviews.length;
      return {
        totalReviews: artisan.reviews.length,
        averageScore: Math.round(averageScore * 10) / 10,
      };
    }
    return null;
  }, [artisan.reviews]);

  const displayStats = aggregateStats || localStats;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton height={100} />
        <Skeleton height={200} />
        <Skeleton height={200} />
      </div>
    );
  }

  if (reviews.length === 0 && (!artisan.reviews || artisan.reviews.length === 0)) {
    return (
      <div className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        {/* Header with title and leave review button */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Avis (0)
          </h3>
          <Button
            variant="outline"
            leftSection={<MessageSquarePlus size={16} />}
            className="cursor-pointer"
            onClick={() => {
              // TODO: Implement review form modal
            }}
          >
            Laisser un avis
          </Button>
        </div>
        <div className="text-center py-8 flex flex-col items-center justify-center gap-4">
          <img src="/empty-state/card_empty.svg" alt="No reviews" width={100} />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Aucun avis pour cet artisan pour le moment.
          </p>
        </div>
      </div>
    );
  }

  // Use reviews from API if available, otherwise fall back to artisan.reviews
  // Type assertion needed because artisan.reviews might not have submittedByUser yet
  const displayReviews = (reviews.length > 0 ? reviews : (artisan.reviews || [])) as Array<{
    id: number;
    ratingCriteria: Record<string, { points: number; label: string }>;
    finalScore: number;
    comment: string | null;
    workPhotos: Array<{
      id: number;
      url: string;
      alternativeText: string | null;
    }>;
    submittedByUser?: {
      id: number;
      username: string;
      email: string;
    } | null;
    submittedAt: string;
    createdAt: string;
  }>;

  return (
    <div className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      {/* Header with title and leave review button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Avis ({displayStats?.totalReviews || displayReviews.length})
        </h3>
        <Button
          variant="outline"
          leftSection={<MessageSquarePlus size={16} />}
          className="cursor-pointer"
          onClick={() => {
            // TODO: Implement review form modal
          }}
        >
          Laisser un avis
        </Button>
      </div>

      {/* Aggregate stats section */}
      {displayStats && (
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-1">
                Note globale
              </p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-300 inline-flex items-center gap-1">
                <strong className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {displayStats.averageScore.toFixed(1)}
                </strong>
                /
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">10</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Basé sur {displayStats.totalReviews} avis
              </p>
            </div>
          </div>

          {/* Criteria averages if available */}
          {aggregateStats?.criteriaAverages && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Moyennes par critère
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(aggregateStats.criteriaAverages).map(([criterionId, average]) => {
                  const criterion = ratingCriteria.find((c) => c.id === criterionId);
                  return (
                    <div key={criterionId} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {criterion?.label || criterionId}
                      </span>
                     { average && <Badge size="sm" className="bg-teal-500 text-white">
                        {average.toFixed(1)}
                      </Badge>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayReviews.map((review) => (
          <div
            key={review.id}
            className={cn(
              "rounded-xl border border-gray-300 dark:border-gray-700",
              "bg-white dark:bg-gray-800 p-4"
            )}
          >
            {/* Posted by user */}
            {review.submittedByUser && (
              <div className="flex items-center gap-2 mb-3">
                <Avatar
                  size="md"
                  radius="xl"
                  color="initials"
                  className="border border-gray-200 dark:border-gray-700"
                >
                  {review.submittedByUser.username?.charAt(0).toUpperCase() || 
                   review.submittedByUser.email?.charAt(0).toUpperCase() || 
                   'U'}
                </Avatar>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {review.submittedByUser.username || review.submittedByUser.email}
                </span>
              </div>
            )}

            {/* Review header */}
            <div className="flex items-center justify-between mb-3">
              <Badge size="sm" className="bg-teal-500 text-white">
                {review.finalScore.toFixed(1)} / 10
              </Badge>
              {review.submittedAt && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  Publié le {new Date(review.submittedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Rating criteria */}
            {review.ratingCriteria && (
              <div className="mb-3 space-y-2">
                {Object.entries(review.ratingCriteria).map(([criterionId, ratingData]) => {
                  const criterion = ratingCriteria.find((c) => c.id === criterionId);
                  // Handle both old format (number) and new format (object with points and label)
                  const points = typeof ratingData === 'number' ? ratingData : ratingData.points;
                  const label = typeof ratingData === 'object' && ratingData.label ? ratingData.label : null;
                  return (
                    <div key={criterionId} className="flex items-center justify-between gap-2 flex-nowrap min-w-0">
                      <span className="flex items-center gap-1 min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          {criterion?.label || criterionId}
                        </p>
                        {label && (
                          <Tooltip label={label} withArrow position="top">
                            <span className="text-xs text-gray-500 dark:text-gray-500 truncate min-w-0">
                              ({label})
                            </span>
                          </Tooltip>
                        )}
                      </span>
                      <Badge size="xs" variant="light" className="bg-teal-50 dark:bg-teal-900/20 flex-shrink-0">
                        {points}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Comment with quote styling */}
            {review.comment && (
              <div className={cn(
                "relative mb-3 p-4 rounded-lg",
                "bg-gray-50 dark:bg-gray-900/50",
                "dark:border-teal-400"
              )}>
                <div className="flex gap-2">
                  <p className={cn(
                    "text-sm text-gray-700 dark:text-gray-300",
                    "leading-relaxed flex-1"
                  )}>
                    {review.comment}
                  </p>
                </div>
              </div>
            )}

            {/* Work photos */}
            {review.workPhotos && review.workPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {review.workPhotos.map((photo) => {
                  // Find the index of this photo in the carousel slides
                  const photoIndex = carouselSlides.findIndex((slide) => slide.id === String(photo.id));
                  
                  const handlePhotoClick = () => {
                    if (photoIndex !== -1) {
                      setModalCurrentIndex(photoIndex);
                      openModal({
                        title: "Photos des travaux",
                        body: (
                          <CarouselModalContent
                            slides={carouselSlides}
                            initialIndex={photoIndex}
                            onIndexChange={setModalCurrentIndex}
                          />
                        ),
                        size: "xl",
                        modalContentClassName: "p-4 sm:p-6",
                        withCloseButton: true,
                      });
                    }
                  };

                  return (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={handlePhotoClick}
                    >
                      <img
                        src={photo.url}
                        alt={photo.alternativeText || "Photo du travail"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
