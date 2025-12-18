"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";
import { useRouter } from "next/navigation";
import { useModalContext } from "@/providers/modal-provider";
import { FilterArtisanForm, FilterValues } from "./forms/FilterArtisan.form";
import { cn } from "../lib/utils";

export function HeroSearchInput() {
  const [profession, setProfession] = useQueryState("profession", parseAsString.withDefault(""));
  const [zones, setZones] = useQueryState("zone", parseAsArrayOf(parseAsString).withDefault([]));
  const { openModal, closeModal } = useModalContext();
  const router = useRouter();

  const filterValues: FilterValues = {
    profession,
    zone: zones,
  };

  const handleFilterSubmit = (values: FilterValues) => {
    // Build search URL with filter params
    const params = new URLSearchParams();
    if (values.profession) params.set("profession", values.profession);
    
    // Handle multiple zones
    if (values.zone) {
      const zoneArray = Array.isArray(values.zone) ? values.zone : [values.zone];
      zoneArray.forEach(z => {
        if (z) params.append("zone", z);
      });
    }
    
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
    setZones(null);
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
    <div className="mx-auto max-w-lg flex justify-center">
      <button
        type="button"
        onClick={handleOpenFilterModal}
        className={cn(
          "relative flex items-center justify-between gap-2 cursor-pointer w-full",
          "px-6 py-4 rounded-full",
          "bg-teal-500  text-white transition-all hover:bg-teal-600/90",
          "dark:bg-teal-600 dark:text-white ",
          "font-medium"
        )}
      >
        <div className="flex items-center justify-between gap-2 w-full">
          <span className="text-lg font-medium">Rechercher un artisan</span>
          <Search className="h-5 w-5 text-white  shrink-0" />
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

