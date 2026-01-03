"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { ArtisanCard } from "../../_components/artisan-card";
import { Autocomplete, ScrollArea, TextInput, Skeleton } from "@mantine/core";
import { Search, SearchX, Loader2, Filter, SlidersHorizontal } from "lucide-react";
import { Switch } from "../../_components/ui";
import { BackButton } from "../../_components/ui";
import { Button } from "@mantine/core";
import { useGetArtisans } from "../../lib/services/artisan";
import { useSearchLocations } from "../../lib/services/location";
import { professions } from "@/constants";
import { useModalContext } from "@/providers/modal-provider";
import { Badge } from "@mantine/core";



function SearchContent() {
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Use nuqs for URL state management
  const [profession, setProfession] = useQueryState("profession", parseAsString.withDefault(""));
  const [zones, setZones] = useQueryState("zone", parseAsArrayOf(parseAsString).withDefault([]));
  const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [hideCommunityAdded, setHideCommunityAdded] = useState(false);

  // Debounce search query to avoid too many API calls
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);

  // Check if user is typing (search query hasn't been debounced yet)
  const isTyping = searchQuery !== debouncedSearchQuery;

  // Fetch all locations for zone autocomplete (client-side filtering)
  const { data: locations = [], isLoading: isLoadingLocations } = useSearchLocations({
    variables: {
      pageSize: 100, // Fetch all cities
    },
  });

  // Prepare zone options for autocomplete
  const zoneOptions = useMemo(() => {
    return locations.map((location) => ({
      value: location.slug || location.city.toLowerCase().replace(/\s+/g, "-"),
      label: location.city,
    }));
  }, [locations]);

  // Fetch artisans from API
  const { data: artisansData, isLoading, error } = useGetArtisans({
    profession: profession || undefined,
    zone: zones.length > 0 ? zones : undefined,
    q: debouncedSearchQuery || undefined,
    page: 1,
    limit: 100, // Fetch up to 100 results for now
  });

  // Show loading state when typing or when API is loading
  const showLoading = isTyping || isLoading;

  // Transform API data to match ArtisanCard props and apply client-side community filter
  const filteredArtisans = useMemo(() => {
    if (!artisansData?.data) return [];

    let artisans = artisansData.data.map((artisan) => ({
      id: artisan.id,
      slug: artisan.slug,
      name: artisan.fullName,
      profession: artisan.profession?.name || "Non spécifié",
      zone:
        artisan.zones && artisan.zones.length > 0
          ? artisan.zones.map((z) => z.name)
          : ["Non spécifié"],
      skills: artisan.skills || "",
      phone: artisan.phoneNumbers?.[0]?.number || "",
      whatsapp: artisan.phoneNumbers?.some((phone) => phone.isWhatsApp) || false,
      imageUrl: artisan.profilePhoto?.url,
      addedByCommunity: artisan.isCommunitySubmitted || false,
    }));

    // Apply client-side community filter
    if (hideCommunityAdded) {
      artisans = artisans.filter((artisan) => !artisan.addedByCommunity);
    }

    return artisans;
  }, [artisansData, hideCommunityAdded]);

  const resultCount = filteredArtisans.length;

  const handleResetFilters = () => {
    setProfession(null);
    setZones(null);
    setSearchQuery(null);
    setHideCommunityAdded(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value || null);
  };

  const hasActiveFilters = profession || zones.length > 0 || hideCommunityAdded;
  const activeFiltersCount = [profession, zones.length > 0, hideCommunityAdded].filter(Boolean).length;

  const handleBack = () => {
    router.push("/");
  };

  const handleOpenFiltersModal = () => {
    openModal({
      title: "Filtres de recherche",
      subtitle: activeFiltersCount > 0 ? `${activeFiltersCount} filtre(s) actif(s)` : undefined,
      body: (
        <div className="px-6 py-4 space-y-6">

          <Autocomplete
            placeholder="Filtrer par métier"
            size="md"
            clearable
            data={professions}
            value={profession}
            onChange={(value) => {
              setProfession(value || null);
            }}
            classNames={{
              input:
                "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
              dropdown:
                "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
              option:
                "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
            }}
          />

          <Autocomplete
            placeholder="Filtrer par zone (Première zone uniquement dans le modal)"
            size="md"
            clearable
            data={zoneOptions}
            value={zones[0] || ""}
            onChange={(value) => {
              setZones(value ? [value] : null);
            }}
            rightSection={isLoadingLocations ?? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
            classNames={{
              input:
                "rounded-lg border-gray-300 bg-white text-gray-900 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
              dropdown:
                "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
              option:
                "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
            }}
          />


          <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
            <Switch
              checked={hideCommunityAdded}
              onCheckedChange={setHideCommunityAdded}
            />
            <label
              onClick={() => setHideCommunityAdded(!hideCommunityAdded)}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
            >
              Par la communauté
            </label>
          </div>

          {/* Reset and Cancel Buttons */}
          <div className="pt-4 border-gray-200 dark:border-gray-800 flex gap-3">
            <Button
              onClick={() => {
                closeModal();
              }}
              variant="outline"
              color="gray"
              radius="md"
              className="flex-1 bg-teal-500 hover:bg-teal-600"
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                handleResetFilters();
              }}
              radius="md"
              className="flex-1"
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      ),
      size: "md",
      modalContentClassName: "px-0",
    });
  };

  return (
    <section className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] px-3 py-3 sm:px-6 sm:py-8 lg:px-8 mt-16 sm:mt-14 mx-auto max-w-6xl flex flex-col">
      {/* Back Button */}
      <div className="mb-3 sm:mb-4 shrink-0">
        <BackButton onClick={handleBack} label="Retour à l'accueil" />
      </div>

      {/* Fixed Title Section */}
      <div className="mb-4 sm:mb-6 shrink-0">
        {showLoading ? (
          <Skeleton height={32} width={180} radius="md" className="sm:h-10 sm:w-64" />
        ) : (
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
            {resultCount} {resultCount === 1 ? "artisan trouvé" : "artisans trouvés"}
          </h1>
        )}
      </div>

      {/* Search Bar with Filter Icon (Mobile) or Filters (Desktop) */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4 shrink-0">
        {/* Search Bar - Mobile: with filter icon, Desktop: full width */}
        <div className="flex items-center gap-2 w-full">

          {/* Filter Button with Badge - Mobile only */}
          {isMobile && (
            <>
              <div className="flex-1">
                <TextInput
                  placeholder="Rechercher par mot clé"
                  size="md"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  leftSection={<Search className="h-4 w-4 sm:h-5 sm:w-5" />}
                  rightSection={
                    isTyping ? (
                      <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
                    ) : null
                  }
                  classNames={{
                    input: "rounded-lg w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                  }}
                />
              </div>
              <button
                onClick={handleOpenFiltersModal}
                className="relative shrink-0 h-[42px] w-[42px] flex items-center justify-center rounded-xl border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                aria-label="Ouvrir les filtres"
              >
                <SlidersHorizontal className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {activeFiltersCount > 0 && (
                  <Badge
                    size="xs"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-teal-500 text-white border-2 border-white dark:border-gray-800"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </button>
            </>
          )}
        </div>

        {/* Desktop Filters - Always visible on desktop */}
        {!isMobile && (
          <div className="space-y-3">
            {/* Filters Row */}
            <div className="flex flex-row gap-3 w-full">
              <Autocomplete
                placeholder="Chercher par métier"
                size="lg"
                clearable
                data={professions}
                value={profession}
                onChange={(value) => {
                  setProfession(value || null);
                }}
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
                placeholder="Chercher par zone (Première zone uniquement ici)"
                size="lg"
                clearable
                data={zoneOptions}
                value={zones[0] || ""}
                onChange={(value) => {
                  setZones(value ? [value] : null);
                }}
                rightSection={isLoadingLocations ?? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
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
              {/* Switch and Reset Button Row */}
              <div className="flex flex-row gap-3 items-center">
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
                    className="text-sm text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-3 font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            <div className="w-full flex justify-end">
              <TextInput
                placeholder="Rechercher par mot clé"
                size="lg"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                leftSection={<Search className="h-4 w-4 sm:h-5 sm:w-5" />}
                rightSection={
                  isTyping ? (
                    <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
                  ) : null
                }
                classNames={{
                  input: "max-w-[400px] rounded-lg w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                }}
              />
            </div>

          </div>
        )}
      </div>

      {/* Scrollable Results List */}
      <ScrollArea
        h="calc(100vh - 20rem)"
        className="sm:h-[calc(100vh - 25rem)] flex-1"
      >
        <div className="flex flex-col gap-3 sm:gap-4 pr-2 sm:pr-4">
          {showLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-start gap-4">
                  <Skeleton height={80} width={80} radius="md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={16} width="40%" />
                    <Skeleton height={16} width="80%" />
                    <Skeleton height={16} width="60%" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="px-12 py-12 rounded-full bg-red-50 dark:bg-red-900/20 mb-6 border-8 border-red-100 dark:border-red-900/30">
                <SearchX className="relative w-20 h-20 text-red-400 dark:text-red-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Erreur de chargement
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-md text-center">
                Une erreur s'est produite lors du chargement des artisans. Veuillez réessayer plus tard.
              </p>
            </div>
          ) : filteredArtisans.length > 0 ? (
            // Results
            filteredArtisans.map((artisan) => (
              <ArtisanCard
                key={artisan.id}
                slug={artisan.slug}
                name={artisan.name}
                profession={artisan.profession}
                zone={artisan.zone}
                skills={artisan.skills}
                phone={artisan.phone}
                whatsapp={artisan.whatsapp}
                addedByCommunity={artisan.addedByCommunity}
                layout="horizontal"
              />
            ))
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="px-12 py-12 rounded-full bg-gray-100 dark:bg-gray-800/50 mb-6 border-8 border-gray-500/10 dark:border-gray-700">
                <SearchX className="relative w-20 h-20 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Aucun artisan trouvé
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-md text-center">
                Aucun artisan ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou de rechercher autre chose.
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
