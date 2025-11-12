"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";
import { useRouter } from "next/navigation";
import { useModalContext } from "@/providers/modal-provider";
import { FilterArtisanForm, FilterValues } from "./forms/FilterArtisan.form";
import { cn } from "../lib/utils";

export function HeroSearchInput() {
  const [profession, setProfession] = useQueryState("profession", parseAsString.withDefault(""));
  const [zone, setZone] = useQueryState("zone", parseAsString.withDefault(""));
  const { openModal, closeModal } = useModalContext();
  const router = useRouter();

  const filterValues: FilterValues = {
    profession,
    zone,
  };

  const handleFilterSubmit = (values: FilterValues) => {
    // Build search URL with filter params
    const params = new URLSearchParams();
    if (values.profession) params.set("profession", values.profession);
    if (values.zone) params.set("zone", values.zone);
    const queryString = params.toString();
    const searchUrl = `/search${queryString ? `?${queryString}` : ""}`;

    // Close modal first, then navigate
    closeModal();

    // Use requestAnimationFrame to ensure modal closes before navigation
    requestAnimationFrame(() => {
      router.push(searchUrl);
    });
  };

  const handleFilterReset = () => {
    // Clear URL params using nuqs
    setProfession(null);
    setZone(null);
    closeModal();
  };

  const handleOpenFilterModal = () => {
    openModal({
      title: "Filtres de recherche",
      subtitle: "Affinez votre recherche par profession et zone",
      body: (
        <FilterArtisanForm
          initialValues={filterValues}
          onSuccess={handleFilterSubmit}
          onReset={handleFilterReset}
        />
      ),
      size: "md",
      modalContentClassName: "p-6",
    });
  };

  // const hasActiveFilters = filterValues.profession || filterValues.zone;

  // const filterCount = [filterValues.profession, filterValues.zone].filter(
  //   Boolean
  // ).length;

  return (
    <div className="mx-auto max-w-2xl flex justify-center">
      <button
        type="button"
        onClick={handleOpenFilterModal}
        className={cn(
          "relative flex items-center justify-between gap-2 cursor-pointer w-full",
          "px-6 py-4 rounded-full",
          "bg-white/80 backdrop-blur-3xl text-gray-700 shadow-xs hover:shadow-md shadow-gray-200 dark:shadow-gray-700 transition-all",
          "border border-gray-200 hover:border-2 hover:border-teal-500",
          "dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
          "font-medium"
        )}
      >
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" />
          <span>Rechercher un artisan</span>
        </div>
        {/* <SlidersHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" /> */}
        {/* {filterCount > 0 && (
          <span
            className={cn(
              "absolute -top-1.5 -right-1.5 flex items-center justify-center",
              "w-6 h-6 px-1.5 rounded-full text-[10px] font-semibold",
              "bg-teal-400 text-white dark:bg-teal-300 dark:text-gray-900",
              "border-2 border-teal-100 dark:border-teal-800"
            )}
          >
            {filterCount}
          </span>
        )} */}
      </button>
    </div>
  );
}

