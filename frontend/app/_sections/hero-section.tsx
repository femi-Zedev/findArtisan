"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { AnimatedProfession } from "../_components/animated-profession";
import { useModalContext } from "@/providers/modal-provider";
import { FilterArtisanForm, FilterValues } from "../_components/forms/FilterArtisan.form";
import { cn } from "../lib/utils";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<FilterValues>({
    profession: "",
    zone: "",
  });
  const { openModal, closeModal } = useModalContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement global search functionality
    console.log("Global search:", searchQuery);
    console.log("Filters:", filterValues);
  };

  const handleFilterSubmit = (values: FilterValues) => {
    // TODO: Implement filter functionality
    console.log("Filters applied:", values);
    setFilterValues(values);
    closeModal();
  };

  const handleFilterReset = () => {
    setFilterValues({ profession: "", zone: "" });
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

  const hasActiveFilters = filterValues.profession || filterValues.zone;

  const filterCount = [filterValues.profession, filterValues.zone].filter(
    Boolean
  ).length;

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

        {/* Search Input with Filter */}
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSearch}>
            <div
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-full",
                "bg-white/80 backdrop-blur-3xl text-gray-700 shadow-xs hover:shadow-md transition-all",
                "border border-gray-200 focus-within:ring-1 focus-within:ring-teal-500 focus-within:ring-offset-2",
                "dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              )}
            >
              <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quel métier cherchez-vous? (ex: plombier)"
                className={cn(
                  "flex-1 bg-transparent border-none outline-none text-base font-normal",
                  "text-gray-700 placeholder:text-gray-500",
                  "dark:text-gray-300 dark:placeholder:text-gray-500"
                )}
              />
              <button
                type="button"
                onClick={handleOpenFilterModal}
                className={cn(
                  "relative flex items-center justify-center shrink-0 cursor-pointer",
                  "rounded-lg p-2 bg-gray-50 hover:bg-teal-100 dark:bg-gray-800 dark:hover:bg-gray-700",
                  "text-gray-500 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300",
                  "transition-colors ",
                  hasActiveFilters && "text-teal-500 bg-teal-100 dark:text-teal-400 dark:bg-teal-800"
                )}
              >
                <SlidersHorizontal className="h-5 w-5" />
                {filterCount > 0 && (
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
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
