"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "../_components/navbar";
import { ArtisanCard } from "../_components/artisan-card";
import { FilterArtisanForm, FilterValues } from "../_components/forms/FilterArtisan.form";
import { Autocomplete } from "@mantine/core";
import { cn } from "../lib/utils";

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

const zones = [
  { value: "akpakpa", label: "Akpakpa" },
  { value: "fidjrosse", label: "Fidjrossè" },
  { value: "calavi", label: "Calavi" },
  { value: "cotonou", label: "Cotonou" },
  { value: "porto-novo", label: "Porto-Novo" },
  { value: "parakou", label: "Parakou" },
];

const professions = [
  { value: "plombier", label: "Plombier" },
  { value: "électricien", label: "Électricien" },
  { value: "menuisier", label: "Menuisier" },
  { value: "peintre", label: "Peintre" },
  { value: "carreleur", label: "Carreleur" },
  { value: "maçon", label: "Maçon" },
  { value: "soudeur", label: "Soudeur" },
  { value: "serrurier", label: "Serrurier" },
  { value: "chauffeur", label: "Chauffeur" },
  { value: "mécanicien", label: "Mécanicien" },
  { value: "coiffeur", label: "Coiffeur" },
  { value: "couturier", label: "Couturier" },
  { value: "cuisinier", label: "Cuisinier" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const [filterValues, setFilterValues] = useState<FilterValues>({
    profession: searchParams.get("profession") || "",
    zone: searchParams.get("zone") || "",
  });
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Update filters when URL params change
  useEffect(() => {
    setFilterValues({
      profession: searchParams.get("profession") || "",
      zone: searchParams.get("zone") || "",
    });
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Filter artisans based on filterValues and searchQuery
  const filteredArtisans = mockArtisans.filter((artisan) => {
    const matchesProfession =
      !filterValues.profession ||
      artisan.profession.toLowerCase().includes(filterValues.profession.toLowerCase());
    const matchesZone =
      !filterValues.zone ||
      artisan.zone.toLowerCase().includes(filterValues.zone.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProfession && matchesZone && matchesSearch;
  });

  const resultCount = filteredArtisans.length;

  const handleFilterChange = (field: keyof FilterValues, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    // TODO: Implement real-time filtering or debounced search
  };

  const handleResetFilters = () => {
    setFilterValues({ profession: "", zone: "" });
  };

  const hasActiveFilters = filterValues.profession || filterValues.zone;

  return (
    <section className="w-full h-full px-4 py-8 sm:px-6 lg:px-8 mt-14 mx-auto max-w-280 flex flex-col overflow-hidden">
      {/* Fixed Title Section */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {resultCount} {resultCount === 1 ? "artisan trouvé" : "artisans trouvés"}
        </h1>
      </div>

      {/* Fixed Filters Row */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center shrink-0">
        <div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <Autocomplete
            placeholder="Quel métier cherchez-vous? (ex: plombier)"
            size="md"
            data={professions}
            value={filterValues.profession}
            onChange={(value) => handleFilterChange("profession", value || "")}
            classNames={{
              input:
                "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
              dropdown:
                "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
              option:
                "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
            }}
            className="flex-1 min-w-[200px]"
          />
          <Autocomplete
            placeholder="Choisir une zone"
            size="md"
            data={zones}
            value={filterValues.zone}
            onChange={(value) => handleFilterChange("zone", value || "")}
            classNames={{
              input:
                "rounded-lg border-gray-300 bg-white text-gray-900 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
              dropdown:
                "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
              option:
                "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
            }}
            className="flex-1 min-w-[200px]"
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
              "border border-gray-300 dark:border-gray-700"
            )}
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Scrollable Results List */}
      <div className="flex flex-col gap-4 overflow-y-auto grow pb-4">
        {filteredArtisans.length > 0 ? (
          filteredArtisans.map((artisan) => (
            <ArtisanCard
              key={artisan.id}
              name={artisan.name}
              profession={artisan.profession}
              zone={artisan.zone}
              description={artisan.description}
              phone={artisan.phone}
              whatsapp={artisan.whatsapp}
              addedByCommunity={artisan.addedByCommunity}
              layout="horizontal"
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Aucun artisan trouvé avec ces critères de recherche.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={

      <section className="w-full px-4 py-8 sm:px-6 lg:px-8 mt-14">
        <div className="mx-auto max-w-6xl">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        </div>
      </section>
    }>
      <SearchContent />
    </Suspense>
  );
}
