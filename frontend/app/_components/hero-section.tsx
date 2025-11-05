"use client";

import { Search } from "lucide-react";
import { AnimatedProfession } from "./animated-profession";
import { useModalContext } from "@/providers/modal-provider";
import { SearchArtisanForm } from "./forms/SearchArtisan.form";
import { cn } from "../lib/utils";

export function HeroSection() {
  const { openModal, closeModal } = useModalContext();

  const handleOpenSearchModal = () => {
    openModal({
      title: "Rechercher un artisan",
      body: (
        <SearchArtisanForm
          onSuccess={(values) => {
            // TODO: Implement search functionality
            console.log("Search:", values);
            closeModal(); // Close modal after search
          }}
        />
      ),
      size: "lg",
      modalContentClassName: "p-6",
    });
  };

  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-8 mt-14">
      <div className="mx-auto max-w-6xl text-center">
        {/* Main Headline */}
        <h1 className="mb-6 text-4xl font-extrabold leading-none tracking-tighter text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          Trouvez le bon <AnimatedProfession /> <br /> près de{" "}
          chez vous
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-lg text-gray-600 dark:text-gray-300 sm:text-xl max-w-2xl mx-auto">
          Accélérez votre recherche avec notre collection d'artisans locaux au Bénin.
          Des plombiers aux électriciens, des menuisiers aux peintres. Trouvez et
          contactez le professionnel qu'il vous faut en quelques clics.
        </p>

        {/* Search Button */}
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleOpenSearchModal}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 rounded-full",
              "bg-white/80 backdrop-blur-3xl text-gray-700 shadow-xs hover:shadow-lg transition-all",
              "border border-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-2",
              "dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            )}
          >
            <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" />
            <span className="flex-1 text-left text-base font-normal">
              Quel métier cherchez-vous? (ex: plombier)
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
