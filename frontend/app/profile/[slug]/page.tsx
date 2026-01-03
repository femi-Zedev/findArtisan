"use client";

import { useParams } from "next/navigation";
import { useGetArtisan } from "@/app/lib/services/artisan";
import { ArtisanBanner } from "./_components/ArtisanBanner";
import { ArtisanHeader } from "./_components/ArtisanHeader";
import { ArtisanTabs } from "./_components/ArtisanTabs";
import { Skeleton, Container } from "@mantine/core";
import { BackButton } from "@/app/_components/ui/BackButton";
import { useRouter } from "next/navigation";

export default function ArtisanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { data: artisan, isLoading, error } = useGetArtisan({ variables: slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Skeleton height={320} />
        <Container size="lg" className="py-8">
          <Skeleton height={200} mb="md" />
          <Skeleton height={400} />
        </Container>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <img src="/empty-state/user_empty.svg" alt="Artisan non trouvé" width={100} />
          <h1 className="text-2xl font-bold text-gray-600 dark:text-white mb-2">
            Artisan non trouvé
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            L'artisan que vous recherchez n'existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:max-w-5xl mx-4 sm:mx-auto">
      <BackButton onClick={() => router.back()} label="Retour" />
      <ArtisanBanner artisan={artisan} />
      <Container size="lg" className="py-6">
        <ArtisanHeader artisan={artisan} />
        <ArtisanTabs artisan={artisan} />
      </Container>
    </div>
  );
}
