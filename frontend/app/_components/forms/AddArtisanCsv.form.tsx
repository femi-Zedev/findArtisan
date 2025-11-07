"use client";

import { useState, useCallback } from "react";
import { Download } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { InfoBox, FileUploadArea } from "../ui";

const CSV_TEMPLATE_HEADERS = [
  "Nom complet",
  "Profession",
  "Zone",
  "Numéro de téléphone",
  "WhatsApp",
  "Description",
  "Facebook",
  "TikTok",
  "Instagram",
];

const CSV_TEMPLATE_EXAMPLE = [
  "Exemple: Jean Dupont",
  "Exemple: Plombier",
  "Exemple: Akpakpa",
  "Exemple: +229 01 96 09 69 69",
  "Oui",
  "Exemple: Description",
  "Exemple: https://facebook.com/...",
  "Exemple: https://tiktok.com/...",
  "Exemple: https://instagram.com/...",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface CsvUploadState {
  file: File | null;
  error: string | null;
  isValid: boolean;
}

interface AddArtisanCsvFormProps {
  onSuccess?: (file: File) => void;
  onError?: (error: string) => void;
}

export function AddArtisanCsvForm({ onSuccess, onError }: AddArtisanCsvFormProps) {
  const [csvState, setCsvState] = useState<CsvUploadState>({
    file: null,
    error: null,
    isValid: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadTemplate = useCallback(() => {
    const csvContent = [
      CSV_TEMPLATE_HEADERS.join(","),
      CSV_TEMPLATE_EXAMPLE.join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template-artisans.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleCsvFileSelect = useCallback(
    (file: File | null) => {
      if (!file) {
        setCsvState({ file: null, error: null, isValid: false });
        return;
      }

      // Validate file
      if (!file.name.toLowerCase().endsWith(".csv")) {
        const error = "Le fichier doit être au format CSV";
        setCsvState({
          file: null,
          error,
          isValid: false,
        });
        if (onError) onError(error);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        const error = `Le fichier est trop volumineux. Taille maximale: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`;
        setCsvState({
          file: null,
          error,
          isValid: false,
        });
        if (onError) onError(error);
        return;
      }

      setCsvState({
        file,
        error: null,
        isValid: true,
      });
    },
    [onError]
  );

  const handleCsvSubmit = useCallback(async () => {
    if (!csvState.file || !csvState.isValid) return;

    setIsProcessing(true);
    try {
      // TODO: Parse CSV and submit to API
      console.log("CSV file:", csvState.file);
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSuccess) {
        onSuccess(csvState.file);
      }
    } catch (error) {
      const errorMessage = "Une erreur est survenue lors du traitement du fichier";
      setCsvState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      if (onError) onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [csvState.file, csvState.isValid, onSuccess, onError]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2">
        <div className="flex flex-col gap-6 pr-2">
          <InfoBox title="Instructions pour l'upload CSV" variant="blue">
            <ol className="space-y-1 list-decimal list-inside">
              <li>Téléchargez le modèle CSV ci-dessous</li>
              <li>Remplissez le fichier avec les informations des artisans</li>
              <li>Uploadez le fichier rempli</li>
              <li>Soumettez pour ajouter tous les artisans</li>
            </ol>
          </InfoBox>


          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Étape 1: Télécharger le modèle
            </label>
            <button
              onClick={handleDownloadTemplate}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
                "bg-white dark:bg-gray-800 border-2 border-teal-500",
                "text-teal-600 dark:text-teal-400 font-semibold",
                "hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              )}
              aria-label="Télécharger le modèle CSV"
            >
              <Download className="h-5 w-5" />
              Télécharger le modèle CSV
            </button>
          </div>

          <FileUploadArea
            onFileSelect={handleCsvFileSelect}
            file={csvState.file}
            error={csvState.error}
            label="Étape 2: Uploader votre fichier CSV rempli"
            accept=".csv"
            maxSize={MAX_FILE_SIZE}
          />
        </div>
      </div>

      <div className="shrink-0 py-6 ">
        <button
          onClick={handleCsvSubmit}
          disabled={!csvState.isValid || isProcessing}
          className={cn(
            "w-full px-6 py-3 rounded-lg font-semibold transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
            csvState.isValid && !isProcessing
              ? "bg-teal-500 hover:bg-teal-600 text-white"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          )}
          aria-label="Soumettre le fichier CSV"
        >
          {isProcessing ? "Traitement en cours..." : "Soumettre le fichier CSV"}
        </button>
      </div>
    </div>
  );
}

