"use client";

import { Button, Autocomplete, Loader, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { useState, useMemo, useCallback } from "react";
import { useSearchLocations } from "@/app/lib/services/location";

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

export interface FilterValues {
  profession: string;
  zone: string;
}

interface FilterArtisanFormProps {
  initialValues?: FilterValues;
  onSuccess?: (values: FilterValues) => void;
  onReset?: () => void;
}

export function FilterArtisanForm({
  initialValues,
  onSuccess,
  onReset,
}: FilterArtisanFormProps) {
  const form = useForm<FilterValues>({
    initialValues: initialValues || {
      profession: "",
      zone: "",
    },
  });

  const [zoneSearchQuery, setZoneSearchQuery] = useState("");

  // Fetch all cities on mount to pre-populate the select
  const { data: allCities, isLoading: isLoadingLocations } = useSearchLocations({
    variables: {
      pageSize: 100, // Fetch all cities, limit to 100
      // No query means fetch all cities
    },
    enabled: true, // Always fetch all cities on mount
  });

  // Transform location results to Select format and filter client-side
  // The Select component with searchable prop will handle filtering
  const zoneOptions = useMemo(() => {
    if (!allCities) return [];

    return allCities.map((location) => ({
      value: location.city,
      label: location.city,
    }));
  }, [allCities]);

  const handleSubmit = (values: FilterValues) => {
    // TODO: Implement filter functionality
    console.log("Filters applied:", values);
    if (onSuccess) {
      onSuccess(values);
    }
  };

  const handleReset = () => {
    form.reset();
    setZoneSearchQuery("");
    if (onReset) {
      onReset();
    }
  };

  // Handle zone selection - update form and clear search query
  const handleZoneChange = useCallback((value: string) => {
    form.setFieldValue("zone", value);
    setZoneSearchQuery(""); // Clear search when a city is selected
  }, [form]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-6">
      <Autocomplete
        placeholder="Quel métier cherchez-vous? (ex: plombier)"
        size="lg"
        data={professions}
        classNames={{
          input:
            "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
          dropdown:
            "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
          option:
            "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
        }}
        {...form.getInputProps("profession")}
      />
      <Select
        placeholder="Sélectionner une ville"
        size="lg"
        data={zoneOptions}
        value={form.values.zone}
        searchable
        onChange={(value) => handleZoneChange(value || "")}
        rightSection={isLoadingLocations ? <Loader size="1rem" /> : null}
        classNames={{
          input:
            "rounded-lg border-gray-300 bg-white text-gray-900 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
          dropdown:
            "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
          option:
            "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
        }}
      />
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="subtle"
          size="lg"
          onClick={handleReset}
          className="flex-1"
        >
          Réinitialiser
        </Button>
        <Button
          type="submit"
          size="lg"
          className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold"
        >
          Appliquer
        </Button>
      </div>
    </form>
  );
}
