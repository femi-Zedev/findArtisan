"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import { useDebouncedValue } from "@mantine/hooks";
import { Navbar } from "../_components/navbar";
import { ArtisanCard } from "../_components/artisan-card";
import { FilterValues } from "../_components/forms/FilterArtisan.form";
import { Autocomplete, ScrollArea, TextInput, Skeleton } from "@mantine/core";
import { Search, SearchX, Loader2 } from "lucide-react";
import { Switch } from "../_components/ui";
import { BackButton } from "../_components/ui";
import { useGetArtisans } from "../lib/services/artisan";
import { useSearchLocations } from "../lib/services/location";
import { professions } from "@/constants";



function SearchContent() {
  const router = useRouter();

  // Use nuqs for URL state management
  const [profession, setProfession] = useQueryState("profession", parseAsString.withDefault(""));
  const [zone, setZone] = useQueryState("zone", parseAsString.withDefault(""));
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
    variables: {
      profession: profession || undefined,
      zone: zone || undefined,
      q: debouncedSearchQuery || undefined,
      page: 1,
      limit: 100, // Fetch up to 100 results for now
    },
  });

  // Show loading state when typing or when API is loading
  const showLoading = isTyping || isLoading;

  // Transform API data to match ArtisanCard props and apply client-side community filter
  const filteredArtisans = useMemo(() => {
    if (!artisansData?.data) return [];

    let artisans = artisansData.data.map((artisan) => ({
      id: artisan.id,
      name: artisan.fullName,
      profession: artisan.profession?.name || "Non spécifié",
      zone:
        artisan.zones && artisan.zones.length > 0
          ? artisan.zones.map((z) => z.name)
          : ["Non spécifié"],
      description: artisan.description || "",
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

  const handleFilterChange = (field: keyof FilterValues, value: string) => {
    if (field === "profession") {
      setProfession(value || null);
    } else if (field === "zone") {
      setZone(value || null);
    }
  };

  const handleResetFilters = () => {
    setProfession(null);
    setZone(null);
    setSearchQuery(null);
    setHideCommunityAdded(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value || null);
  };

  const hasActiveFilters = profession || zone || searchQuery || hideCommunityAdded;

  const handleBack = () => {
    router.push("/");
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

      {/* Fixed Filters Row */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4 shrink-0">
        {/* Search by keyword - Full width on mobile */}
        <div className="w-full">
          <TextInput
            placeholder="Rechercher par mot clé"
            size="md"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftSection={<Search className="h-4 w-4 sm:h-5 sm:w-5" />}
            rightSection={
              isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              ) : null
            }
            classNames={{
              input: "rounded-lg w-full sm:min-w-[520px] border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
            }}
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Autocomplete
            placeholder="Chercher par métier"
            size="md"
            clearable
            data={professions}
            value={profession}
            onChange={(value) => handleFilterChange("profession", value || "")}
            classNames={{
              input:
                "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
              dropdown:
                "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
              option:
                "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
            }}
            className="flex-1 w-full sm:min-w-[150px]"
          />
          <Autocomplete
            placeholder="Chercher par zone"
            size="md"
            clearable
            data={zoneOptions}
            value={zone}
            onChange={(value) => handleFilterChange("zone", value || "")}
            rightSection={isLoadingLocations ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : null}
            classNames={{
              input:
                "rounded-lg border-gray-300 bg-white text-gray-900 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
              dropdown:
                "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
              option:
                "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
            }}
            className="flex-1 w-full sm:min-w-[150px]"
          />
        </div>

        {/* Switch and Reset Button Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-3 py-2.5 sm:px-4 sm:py-3 dark:border-gray-700 dark:bg-gray-800 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 w-full sm:w-auto">
            <Switch
              checked={hideCommunityAdded}
              onCheckedChange={setHideCommunityAdded}
            />
            <label
              onClick={() => setHideCommunityAdded(!hideCommunityAdded)}
              className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
            >
              Masquer les ajouts communautaires
            </label>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs sm:text-sm text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 sm:px-4 sm:py-3 font-medium rounded-xl transition-colors cursor-pointer w-full sm:w-auto"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Results List */}
      <ScrollArea h="calc(100vh - 28rem)" className="sm:h-[calc(100vh - 25rem)] flex-1">
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
