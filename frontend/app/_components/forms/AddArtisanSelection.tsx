"use client";

import { useState, useCallback } from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { AddArtisanForm } from "./AddArtisan.form";
import { AddArtisanFormValues } from "./AddArtisan.form";
import { AddArtisanCsvForm, ParsedArtisan } from "./AddArtisanCsv.form";
import { BackButton, InfoBox, MethodCard } from "../ui";

interface AddArtisanSelectionProps {
  onSuccess?: (values: AddArtisanFormValues) => void;
  onBack?: () => void;
}

type SelectionMethod = "form" | "csv" | null;

export function AddArtisanSelection({ onSuccess, onBack }: AddArtisanSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<SelectionMethod>(null);

  const handleCsvSuccess = useCallback(
    (parsedData: ParsedArtisan[]) => {
      // CSV batch submission was successful, close drawer by calling parent onSuccess
      if (onSuccess) {
        // Call parent onSuccess to trigger drawer close
        // The parent component (e.g., recently-added-section) will handle closing the drawer
        onSuccess({} as AddArtisanFormValues); // Pass empty object as placeholder
      }
    },
    [onSuccess]
  );

  const handleCsvError = useCallback((error: string) => {
    console.error("CSV error:", error);
    // TODO: Show error toast or notification
  }, []);

  const handleBack = useCallback(() => {
    setSelectedMethod(null);
  }, []);

  // Form method selected
  if (selectedMethod === "form") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <BackButton onClick={handleBack} />
        <div className="flex-1 overflow-y-auto">
          <AddArtisanForm />
        </div>
      </div>
    );
  }

  // CSV method selected
  if (selectedMethod === "csv") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <BackButton onClick={handleBack} />
        <AddArtisanCsvForm onSuccess={handleCsvSuccess} onError={handleCsvError} />
      </div>
    );
  }

  // Selection screen
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto overflo
      w-x-hidden pr-2 -mr-2">
        <div className="flex flex-col gap-6 pr-2">
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
            />
            <MethodCard
              icon={FileSpreadsheet}
              title="Upload CSV"
              description="Ajouter plusieurs artisans en une seule fois via fichier CSV"
              onClick={() => setSelectedMethod("csv")}
            />
          </div>

          <InfoBox variant="teal">
            <p>
              <strong>💡 Note:</strong> Pour le format CSV, vous devrez télécharger le modèle, le remplir avec les informations des artisans, puis l&apos;uploader. Cette méthode est plus adaptée pour ajouter plusieurs artisans en une seule fois.
            </p>
          </InfoBox>
        </div>
      </div>
    </div>
  );
}
