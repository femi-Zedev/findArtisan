"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "../_components/navbar";
import { ArtisanCard } from "../_components/artisan-card";
import { FilterArtisanForm, FilterValues } from "../_components/forms/FilterArtisan.form";
import { Autocomplete, Button, ScrollArea, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { Switch } from "../_components/ui";
import { BackButton } from "../_components/ui";
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
  const router = useRouter();
  const [filterValues, setFilterValues] = useState<FilterValues>({
    profession: searchParams.get("profession") || "",
    zone: searchParams.get("zone") || "",
  });
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [hideCommunityAdded, setHideCommunityAdded] = useState(false);

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
    const matchesCommunity =
      !hideCommunityAdded || artisan.addedByCommunity === false;

    return matchesProfession && matchesZone && matchesSearch && matchesCommunity;
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
    setSearchQuery("");
    setHideCommunityAdded(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const hasActiveFilters = filterValues.profession || filterValues.zone || searchQuery || hideCommunityAdded;

  const handleBack = () => {
    router.push("/");
  };

  return (
    <section className="w-full h-[calc(100vh-5rem)] px-4 py-8 sm:px-6 lg:px-8 mt-14 mx-auto max-w-6xl flex flex-col">
      {/* Back Button */}
      <div className="mb-4 shrink-0">
        <BackButton onClick={handleBack} label="Retour à l'accueil" />
      </div>

      {/* Fixed Title Section */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {resultCount} {resultCount === 1 ? "artisan trouvé" : "artisans trouvés"}
        </h1>
      </div>

      {/* Fixed Filters Row */}
      <div className="mb-6 space-y-4">

        <div className="flex-1 items-center w-full sm:w-auto flex flex-col sm:flex-row gap-3">

          <Autocomplete
            placeholder="Quel métier cherchez-vous? (ex: plombier)"
            size="lg"
            clearable
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
            className="flex-1 min-w-[150px]"
          />
          <Autocomplete
            placeholder="Choisir une zone"
            size="lg"
            clearable
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
            className="flex-1 min-w-[150px]"
          />
          <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
            <Switch
              checked={hideCommunityAdded}
              onCheckedChange={setHideCommunityAdded}
            />
            <label
              onClick={() => setHideCommunityAdded(!hideCommunityAdded)}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
            >
              Masquer les ajouts communautaires
            </label>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              Réinitialiser
            </button>
          )}
        </div>
        <div className="flex w-full justify-end items-center  sm:w-auto  flex-col sm:flex-row gap-3">
          <TextInput
            placeholder="Rechercher par mot clé"
            size="lg"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftSection={<Search className="h-5 w-5 " />}
            classNames={{
              input: "rounded-lg min-w-[520px] border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
            }}
          />
        </div>
      </div>

      {/* Scrollable Results List */}
      <ScrollArea h="calc(100vh - 25rem)" className="flex-1">
        <div className="flex flex-col gap-4 pr-4">
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
      </ScrollArea>
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
