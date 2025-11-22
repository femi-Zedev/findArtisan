"use client";

import { ArtisanCard } from "../_components/artisan-card";
import { useDrawerContext } from "@/providers/drawer-provider";
import { useModalContext } from "@/providers/modal-provider";
import { useUserStore } from "@/stores/userStore";
import { AddArtisanSelection } from "../_components/forms/AddArtisanSelection";
import { GoogleLoginModal } from "../_components/modals/GoogleLoginModal";
import { Button } from "@mantine/core";
import { cn } from "../lib/utils";
import { PlusIcon } from "lucide-react";

// Mock data - will be replaced with API data later
const mockArtisans = [
  {
    id: 1,
    name: "Jean-Baptiste Koffi",
    profession: "Plombier",
    zone: "Akpakpa",
    description:
      "Spécialiste en installation et réparation de plomberie. Plus de 10 ans d'expérience.",
    phone: "+22912345678",
    whatsapp: true,
    addedByCommunity: false,
  },
  {
    id: 2,
    name: "Marie Adjovi",
    profession: "Électricien",
    zone: "Fidjrossè",
    description:
      "Installation électrique résidentielle et commerciale. Service rapide et professionnel.",
    phone: "+22923456789",
    whatsapp: true,
    addedByCommunity: true,
  },
  {
    id: 3,
    name: "Serge Dossou",
    profession: "Menuisier",
    zone: "Akpakpa",
    description:
      "Fabrication de meubles sur mesure, portes, fenêtres et armoires. Travail de qualité garantie.",
    phone: "+22934567890",
    whatsapp: true,
    addedByCommunity: false,
  },
  {
    id: 4,
    name: "Kossi Agbessi",
    profession: "Plombier",
    zone: "Calavi",
    description:
      "Intervention rapide pour toutes urgences de plomberie. Disponible 24/7.",
    phone: "+22945678901",
    whatsapp: true,
    addedByCommunity: false,
  },
  {
    id: 5,
    name: "Fatou Diallo",
    profession: "Électricien",
    zone: "Cotonou",
    description:
      "Électricité générale, dépannage et installation. Certifié et assuré.",
    phone: "+22956789012",
    whatsapp: true,
    addedByCommunity: true,
  },
  {
    id: 6,
    name: "Amadou Bamba",
    profession: "Menuisier",
    zone: "Porto-Novo",
    description:
      "Menuiserie traditionnelle et moderne. Réalisations sur mesure pour particuliers et entreprises.",
    phone: "+22967890123",
    whatsapp: true,
    addedByCommunity: false,
  },
];

export function RecentlyAddedSection() {
  const artisans = mockArtisans;
  const count = artisans.length;
  const { openDrawer, closeDrawer } = useDrawerContext();
  const { openModal } = useModalContext();
  const { isAuthenticated } = useUserStore();

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
            // TODO: Implement API call to submit artisan
            console.log("Artisan added:", values);
            closeDrawer();
            // TODO: Show success toast notification
          }}
        />
      ),
      size: "xl",
      bodyClassName: "p-6 overflow-y-hidden",
    });
  };

  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Ajoutés récemment
          </h2>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-base text-gray-800 dark:text-gray-400 sm:text-lg font-medium">
              Tu connais un artisan fiable ? Aide ta communauté en l'ajoutant 👉
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

        {/* Artisans Grid */}
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
              addedByCommunity={artisan.addedByCommunity}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
