"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import { InfoBox, MethodCard } from "../ui";
import { useState } from "react";
import { FormArea, ButtonsArea } from "../shared";
import { Button } from "@mantine/core";

export function AddArtisanSelection({ onSelectMethod }: { onSelectMethod: (method: "form" | "csv") => void }) {
  const [selectedMethod, setSelectedMethod] = useState<"form" | "csv" | null>(null);

  const handleConfirm = () => {
    if (selectedMethod) {
      onSelectMethod(selectedMethod);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FormArea className="gap-6">
        <span className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Choisissez votre méthode préférée pour ajouter des artisans.
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Important: </strong>
            Le format CSV est recommandé si vous souhaitez ajouter plusieurs artisans en une seule fois.
          </p>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MethodCard
            icon={FileText}
            title="Formulaire"
            description="Ajouter un artisan à la fois avec un formulaire détaillé"
            onClick={() => setSelectedMethod("form")}
            isSelected={selectedMethod === "form"}
          />
          <MethodCard
            icon={FileSpreadsheet}
            title="Upload CSV"
            description="Ajouter plusieurs artisans en une seule fois via fichier CSV"
            onClick={() => setSelectedMethod("csv")}
            isSelected={selectedMethod === "csv"}
          />
        </div>

        <InfoBox variant="teal">
          <p>
            <strong>💡 Note:</strong> Pour le format CSV, vous devrez télécharger le modèle, le remplir avec les informations des artisans, puis l&apos;uploader. Cette méthode est plus adaptée pour ajouter plusieurs artisans en une seule fois.
          </p>
        </InfoBox>
      </FormArea>

      <ButtonsArea>
        <Button
          type="button"
          size="lg"
          onClick={handleConfirm}
          disabled={!selectedMethod}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuer
        </Button>
      </ButtonsArea>
    </div>
  );
}
