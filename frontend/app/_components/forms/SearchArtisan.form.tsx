"use client";

import { Button, Autocomplete } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Search } from "lucide-react";

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

export interface SearchFormValues {
  profession: string;
  zone: string;
}

interface SearchArtisanFormProps {
  onSuccess?: (values: SearchFormValues) => void;
}

export function SearchArtisanForm({ onSuccess }: SearchArtisanFormProps) {
  const form = useForm<SearchFormValues>({
    initialValues: {
      profession: "",
      zone: "",
    },
  });

  const handleSubmit = (values: SearchFormValues) => {
    // TODO: Implement search functionality
    console.log("Search:", values);
    if (onSuccess) {
      onSuccess(values);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className="flex flex-col gap-6 my-2">
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
        <Autocomplete
          placeholder="Choisir une zone"
          size="lg"
          data={zones}
          classNames={{
            input:
              "rounded-lg border-gray-300 bg-white text-gray-900 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white",
            dropdown:
              "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-800",
            option:
              "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
          }}
          {...form.getInputProps("zone")}
        />
        <Button
          type="submit"
          size="lg"
          leftSection={<Search className="h-5 w-5" />}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold w-full"
        >
          Rechercher
        </Button>
      </div>
    </form>
  );
}

