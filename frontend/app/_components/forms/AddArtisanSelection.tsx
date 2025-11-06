"use client";

import { useState } from "react";
import { FileText, Upload, Download, Info, FileSpreadsheet } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { AddArtisanForm } from "./AddArtisan.form";
import { AddArtisanFormValues } from "./AddArtisan.form";

interface AddArtisanSelectionProps {
  onSuccess?: (values: AddArtisanFormValues) => void;
  onBack?: () => void;
}

export function AddArtisanSelection({ onSuccess, onBack }: AddArtisanSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<"form" | "csv" | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleDownloadTemplate = () => {
    // Create CSV template
    const csvContent = [
      "Nom complet,Profession,Zone,Numéro de téléphone,WhatsApp,Description,Facebook,TikTok,Instagram",
      "Exemple: Jean Dupont,Exemple: Plombier,Exemple: Akpakpa,Exemple: +229 01 96 09 69 69,Oui,Exemple: Description,Exemple: https://facebook.com/...,Exemple: https://tiktok.com/...,Exemple: https://instagram.com/...",
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
  };

  const handleCsvUpload = (file: File) => {
    setCsvFile(file);
    // TODO: Parse CSV and validate
    // TODO: Show preview or validation errors
  };

  const handleCsvSubmit = () => {
    if (!csvFile) return;
    // TODO: Parse CSV and submit to API
    console.log("CSV file:", csvFile);
    // For now, just log - will implement CSV parsing later
  };

  // If form method is selected, show the form
  if (selectedMethod === "form") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <button
          onClick={() => setSelectedMethod(null)}
          className="mb-4 text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          ← Retour au choix
        </button>
        <AddArtisanForm onSuccess={onSuccess} />
      </div>
    );
  }

  // If CSV method is selected, show CSV upload interface
  if (selectedMethod === "csv") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <button
          onClick={() => setSelectedMethod(null)}
          className="mb-4 text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          ← Retour au choix
        </button>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2">
          <div className="flex flex-col gap-6 pr-2">
            {/* Instructions */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Instructions pour l&apos;upload CSV
                  </p>
                  <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                    <li>Téléchargez le modèle CSV ci-dessous</li>
                    <li>Remplissez le fichier avec les informations des artisans</li>
                    <li>Uploadez le fichier rempli</li>
                    <li>Soumettez pour ajouter tous les artisans</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Note about CSV */}
            <div className="rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-4">
              <p className="text-sm text-teal-900 dark:text-teal-200">
                <strong>💡 Astuce:</strong> Le format CSV est idéal pour ajouter plusieurs artisans en une seule fois.
              </p>
            </div>

            {/* Download Template */}
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
                  "hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                )}
              >
                <Download className="h-5 w-5" />
                Télécharger le modèle CSV
              </button>
            </div>

            {/* Upload CSV */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Étape 2: Uploader votre fichier CSV rempli
              </label>
              <label
                htmlFor="csv-upload"
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed",
                  "border-gray-300 dark:border-gray-700",
                  "bg-gray-50 dark:bg-gray-800/50",
                  "hover:border-teal-500 dark:hover:border-teal-500",
                  "hover:bg-teal-50/50 dark:hover:bg-teal-900/10",
                  "cursor-pointer transition-colors"
                )}
              >
                <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cliquez pour uploader ou glissez-déposez
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Fichier CSV uniquement
                  </p>
                </div>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCsvUpload(file);
                  }}
                />
              </label>
              {csvFile && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-800 dark:text-green-200 flex-1">
                    {csvFile.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="shrink-0 p-6 mt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleCsvSubmit}
            disabled={!csvFile}
            className={cn(
              "w-full px-6 py-3 rounded-lg font-semibold transition-colors",
              csvFile
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            Soumettre le fichier CSV
          </button>
        </div>
      </div>
    );
  }

  // Show selection screen
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2">
        <div className="flex flex-col gap-6 pr-2">
          {/* Instructions */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Choisissez votre méthode préférée pour ajouter des artisans. Le format CSV est recommandé si vous souhaitez ajouter plusieurs artisans en une seule fois.
                </p>
              </div>
            </div>
          </div>

          {/* Selection Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Form Option */}
            <button
              onClick={() => setSelectedMethod("form")}
              className={cn(
                "flex flex-col items-center gap-4 p-6 rounded-xl border-2",
                "border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800",
                "hover:border-teal-500 dark:hover:border-teal-500",
                "hover:bg-teal-50/50 dark:hover:bg-teal-900/10",
                "transition-all cursor-pointer group"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
                <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Formulaire
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ajouter un artisan à la fois avec un formulaire détaillé
                </p>
              </div>
            </button>

            {/* CSV Option */}
            <button
              onClick={() => setSelectedMethod("csv")}
              className={cn(
                "flex flex-col items-center gap-4 p-6 rounded-xl border-2",
                "border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800",
                "hover:border-teal-500 dark:hover:border-teal-500",
                "hover:bg-teal-50/50 dark:hover:bg-teal-900/10",
                "transition-all cursor-pointer group"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
                <FileSpreadsheet className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Upload CSV
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ajouter plusieurs artisans en une seule fois via fichier CSV
                </p>
              </div>
            </button>
          </div>

          {/* CSV Note */}
          <div className="rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-4">
            <p className="text-sm text-teal-900 dark:text-teal-200">
              <strong>💡 Note:</strong> Pour le format CSV, vous devrez télécharger le modèle, le remplir avec les informations des artisans, puis l&apos;uploader. Cette méthode est plus adaptée pour ajouter plusieurs artisans en une seule fois.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

