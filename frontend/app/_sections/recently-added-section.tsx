"use client";

import { ArtisanCard } from "../_components/artisan-card";
import { Skeleton, Button } from "@mantine/core";
import { useGetRecentlyAdded } from "../lib/services/artisan";
import { useQueryClient } from "@tanstack/react-query";
import { useDrawerContext } from "@/providers/drawer-provider";
import { useModalContext } from "@/providers/modal-provider";
import { useUserStore } from "@/stores/userStore";
import { AddArtisanSelection } from "../_components/forms/AddArtisanSelection";
import { GoogleLoginModal } from "../_components/modals/GoogleLoginModal";
import { PlusIcon } from "lucide-react";
import { artisanKeys } from "../lib/services/artisan";
import { notifications } from "@mantine/notifications";

export function RecentlyAddedSection() {
  const { data, isLoading, error } = useGetRecentlyAdded({ variables: 6 });
  const queryClient = useQueryClient();
  const { openDrawer, closeDrawer } = useDrawerContext();
  const { openModal } = useModalContext();
  const { isAuthenticated } = useUserStore();

  // Transform API data to match ArtisanCard props and limit to 6
  const artisans = (data?.data?.map((artisan) => ({
    id: artisan.id,
    name: artisan.fullName,
    profession: artisan.profession?.name || "Non spécifié",
    zone: artisan.zones && artisan.zones.length > 0
      ? artisan.zones.map((z) => z.name)
      : ["Non spécifié"],
    description: artisan.description || "",
    phone: artisan.phoneNumbers?.[0]?.number || "",
    whatsapp: artisan.phoneNumbers?.some((phone) => phone.isWhatsApp) || false,
    imageUrl: artisan.profilePhoto?.url,
    addedByCommunity: artisan.isCommunitySubmitted || false,
  })) || []).slice(0, 6);

  const handleOpenAddArtisanDrawer = () => {
    // If user is not authenticated, show login modal first
    if (!isAuthenticated) {
      openModal({
        title: "Connexion requise",
        body: <GoogleLoginModal />,
        size: "md",
        withCloseButton: true,
      });
      return;
    }

    // If authenticated, open drawer with selection screen
    openDrawer({
      title: "Ajouter un artisan",
      body: (
        <AddArtisanSelection
          onSuccess={(values) => {
            // Invalidate and refetch recently added artisans
            queryClient.invalidateQueries({ queryKey: artisanKeys.recentlyAdded() });
            closeDrawer();
            notifications.show({
              title: "Artisan ajouté",
              message: "L'artisan a été ajouté avec succès",
              color: "green",
              autoClose: 3000,
            });
          }}
        />
      ),
      size: "xl",
      bodyClassName: "p-6 overflow-y-hidden",
    });
  };

  return (
    <section className="w-full py-8 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Ajoutés récemment
          </h2>
        </div>

        {/* Artisans Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} height={300} radius="md" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">
              Erreur lors du chargement des artisans. Veuillez réessayer plus tard.
            </p>
          </div>
        ) : artisans.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aucun artisan ajouté récemment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artisans.map((artisan) => (
              <ArtisanCard
                key={artisan.id}
                name={artisan.name}
                profession={artisan.profession}
                zone={artisan.zone}
                description={artisan.description}
                phone={artisan.phone}
                whatsapp={artisan.whatsapp}
                imageUrl={artisan.imageUrl}
                addedByCommunity={artisan.addedByCommunity}
              />
            ))}
          </div>
        )}

        {/* Add Artisan CTA - After showing value */}
        <div className="mt-12 flex  flex-col items-center justify-center gap-8 py-8">
          <span className="text-center text-xl font-semibold text-gray-600 dark:text-gray-300 sm:text-2xl">
            Tu connais un artisan fiable ? <br /> Aide ta communauté en l'ajoutant <br />👇
          </span>
          <Button
            onClick={handleOpenAddArtisanDrawer}
            rightSection={<PlusIcon className="h-4 w-4" />}
            size="md"
            className="h-10 rounded-full bg-teal-500 px-4 font-semibold text-white transition-all hover:bg-teal-600 shadow-sm hover:shadow-md"
          >
            <span className="hidden sm:inline">Ajouter un artisan</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
