"use client";

import { Button, Select, TextInput, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Search, Star, Play } from "lucide-react";
import { AnimatedProfession } from "./animated-profession";
import { useState } from "react";
import { cn } from "../lib/utils";

const zones = [
  { value: "akpakpa", label: "Akpakpa" },
  { value: "fidjrosse", label: "Fidjrossè" },
  { value: "calavi", label: "Calavi" },
  { value: "cotonou", label: "Cotonou" },
  { value: "porto-novo", label: "Porto-Novo" },
  { value: "parakou", label: "Parakou" },
];

interface SearchFormValues {
  profession: string;
  zone: string;
}

export function HeroSection() {
  const [opened, setOpened] = useState(false);
  const form = useForm<SearchFormValues>({
    initialValues: {
      profession: "",
      zone: "",
    },
  });

  const handleSubmit = (values: SearchFormValues) => {
    // TODO: Implement search functionality
    console.log("Search:", values);
    setOpened(false); // Close modal after search
  };

  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
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
            onClick={() => setOpened(true)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 rounded-full",
              "bg-white text-gray-700 shadow-lg hover:shadow-xl transition-all",
              "border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
              "dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            )}
          >
            <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-left text-base font-normal">
              Quel métier cherchez-vous? (ex: plombier)
            </span>
          </button>
        </div>

        {/* Search Modal */}
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Rechercher un artisan"
          centered
          size="lg"
          classNames={{
            content:
              "bg-white dark:bg-gray-900 rounded-xl",
            header: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
            title: "text-gray-900 dark:text-white font-semibold text-xl",
            body: "bg-white dark:bg-gray-900",
          }}
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4">
              <TextInput
                placeholder="Quel métier cherchez-vous? (ex: plombier)"
                size="lg"
                classNames={{
                  input:
                    "rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
                }}
                {...form.getInputProps("profession")}
              />
              <Select
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
        </Modal>
      </div>
    </section>
  );
}
