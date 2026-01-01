"use client";

import { useState, useCallback } from "react";
import { Button, Table, Badge, Alert } from "@mantine/core";
import { Download, AlertCircle, CheckCircle2, Eye, EyeOff, FileDown } from "lucide-react";
import * as Papa from "papaparse";
import * as XLSX from "xlsx";
import { cn } from "@/app/lib/utils";
import { InfoBox, FileUploadArea } from "../ui";
import { FormArea, ButtonsArea } from "../shared";
import { useCreateBatchArtisans, type CreateBatchArtisanPayload, type BatchCreateArtisanResponse } from "@/app/lib/services/artisan";
import { notifications } from "@mantine/notifications";
import { useUserStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";
import { useDrawerContext } from "@/providers/drawer-provider";

const CSV_TEMPLATE_HEADERS = [
  "Nom complet *",
  "Profession *",
  "Zone *",
  "Numéro de téléphone *",
  "WhatsApp",
  "Description",
  "Facebook",
  "TikTok",
  "Instagram",
];

const CSV_TEMPLATE_EXAMPLE = [
  "Jean-Baptiste Koffi",
  "Plombier",
  "Akpakpa",
  "+229 01 96 09 69 69",
  "Oui",
  "Spécialiste en installation et réparation de plomberie",
  "https://facebook.com/jean.koffi",
  "https://tiktok.com/jean.koffi",
  "https://instagram.com/jean.koffi",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Helper function to normalize headers (remove asterisks and trim)
function normalizeHeader(header: string): string {
  return header.replace(/\s*\*\s*$/, "").trim();
}

// Helper function to ensure URL has protocol
function ensureUrlProtocol(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();
  if (!trimmed.match(/^https?:\/\//i)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

// Transform parsed CSV data to API format
function transformParsedDataToApiFormat(
  parsedData: ParsedArtisan[],
  isAdmin: boolean = false
): CreateBatchArtisanPayload[] {
  return parsedData.map((row) => {
    // Transform phone number
    const phoneNumbers = [];
    if (row["Numéro de téléphone"]?.trim()) {
      phoneNumbers.push({
        number: row["Numéro de téléphone"].trim(),
        is_whatsapp: row.WhatsApp?.toLowerCase() === "oui",
      });
    }

    // Transform social links
    const socialLinks = [];
    if (row.Facebook?.trim()) {
      socialLinks.push({
        platform: "facebook",
        link: ensureUrlProtocol(row.Facebook.trim()),
      });
    }
    if (row.TikTok?.trim()) {
      socialLinks.push({
        platform: "tiktok",
        link: ensureUrlProtocol(row.TikTok.trim()),
      });
    }
    if (row.Instagram?.trim()) {
      socialLinks.push({
        platform: "instagram",
        link: ensureUrlProtocol(row.Instagram.trim()),
      });
    }

    // Transform zones (split by comma if multiple)
    const zones = row.Zone?.split(",").map((z) => z.trim()).filter(Boolean) || [];

    return {
      full_name: row["Nom complet"].trim(),
      skills: row.Description?.trim() || "",
      profession: row.Profession?.trim(),
      zones: zones.length > 0 ? zones : undefined,
      phone_numbers: phoneNumbers.length > 0 ? phoneNumbers : undefined,
      social_links: socialLinks.length > 0 ? socialLinks : undefined,
      is_community_submitted: isAdmin ? false : true,
      status: "approved",
    };
  });
}

// Generate error report XLS file with failed rows
function generateErrorReport(
  failedRows: ParsedArtisan[],
  batchResults: BatchCreateArtisanResponse
): void {
  // Create a map of row index to errors
  const errorMap = new Map<number, string[]>();
  batchResults.results.forEach((result) => {
    if (!result.success && result.errors) {
      errorMap.set(result.index, result.errors);
    }
  });

  // Prepare data for Excel
  const headers = [...CSV_TEMPLATE_HEADERS, "Erreurs"];
  const rows = failedRows.map((row) => {
    const rowIndex = row._rowIndex || 0;
    const errors = errorMap.get(rowIndex) || [];
    return [
      row["Nom complet"] || "",
      row.Profession || "",
      row.Zone || "",
      row["Numéro de téléphone"] || "",
      row.WhatsApp || "",
      row.Description || "",
      row.Facebook || "",
      row.TikTok || "",
      row.Instagram || "",
      errors.join("; "), // Join multiple errors with semicolon
    ];
  });

  // Create workbook
  const workbook = XLSX.utils.book_new();
  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const columnWidths = [
    { wch: 25 }, // Nom complet
    { wch: 15 }, // Profession
    { wch: 15 }, // Zone
    { wch: 20 }, // Numéro de téléphone
    { wch: 10 }, // WhatsApp
    { wch: 40 }, // Description
    { wch: 30 }, // Facebook
    { wch: 30 }, // TikTok
    { wch: 30 }, // Instagram
    { wch: 50 }, // Erreurs
  ];
  worksheet["!cols"] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Lignes en erreur");

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  const filename = `erreurs-import-${timestamp}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, filename);
}

export interface ParsedArtisan {
  "Nom complet": string;
  Profession: string;
  Zone: string;
  "Numéro de téléphone": string;
  WhatsApp: string;
  Description: string;
  Facebook: string;
  TikTok: string;
  Instagram: string;
  _rowIndex?: number;
  _errors?: string[];
}

interface CsvUploadState {
  file: File | null;
  error: string | null;
  isValid: boolean;
  parsedData: ParsedArtisan[];
  validationErrors: Array<{ row: number; errors: string[] }>;
}

interface AddArtisanCsvFormProps {
  onSuccess?: (parsedData: ParsedArtisan[]) => void;
  onError?: (error: string) => void;
  onPrevious?: () => void;
}

function validateParsedData(data: ParsedArtisan[]): Array<{ row: number; errors: string[] }> {
  const errors: Array<{ row: number; errors: string[] }> = [];

  data.forEach((row, index) => {
    const rowErrors: string[] = [];
    const rowNumber = index + 2; // +2 because index 0 is header, so first data row is 2

    if (!row["Nom complet"]?.trim()) {
      rowErrors.push("Le nom complet est requis");
    }
    if (!row.Profession?.trim()) {
      rowErrors.push("La profession est requise");
    }
    if (!row.Zone?.trim()) {
      rowErrors.push("La zone est requise");
    }
    if (!row["Numéro de téléphone"]?.trim()) {
      rowErrors.push("Le numéro de téléphone est requis");
    }
    if (row.WhatsApp && !["Oui", "Non", "oui", "non", "OUI", "NON", ""].includes(row.WhatsApp)) {
      rowErrors.push('WhatsApp doit être "Oui" ou "Non"');
    }

    if (rowErrors.length > 0) {
      errors.push({ row: rowNumber, errors: rowErrors });
    }
  });

  return errors;
}

export function AddArtisanCsvForm({ onSuccess, onError, onPrevious }: AddArtisanCsvFormProps) {
  const { isAdmin } = useUserStore();
  const { data: session } = useSession();
  const jwt = (session?.user as any)?.strapiJwt || '';
  const { closeDrawer } = useDrawerContext();
  const [csvState, setCsvState] = useState<CsvUploadState>({
    file: null,
    error: null,
    isValid: false,
    parsedData: [],
    validationErrors: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchCreateArtisanResponse | null>(null);

  const batchMutation = useCreateBatchArtisans({
    onSuccess: (response) => {
      setBatchResult(response);

      if (response.created > 0) {
        notifications.show({
          title: 'Import terminé avec succès',
          message: `${response.created} artisan(s) créé(s) sur ${response.total}`,
          color: 'green',
          autoClose: 5000,
        });
      }

      if (response.failed > 0) {
        notifications.show({
          title: 'Import partiel',
          message: `${response.failed} ligne(s) ont échoué. Téléchargez le rapport d'erreurs.`,
          color: 'orange',
          autoClose: 7000,
        });
      }

      // If all succeeded, close drawer after showing success message
      if (response.failed === 0) {
        // Show success message briefly, then close drawer
        setTimeout(() => {
          closeDrawer();
          if (onSuccess) {
            onSuccess(csvState.parsedData);
          }
        }, 2000); // 2 second delay to show success message
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.error?.message || 'Une erreur est survenue lors de l\'import';
      notifications.show({
        title: 'Erreur lors de l\'import',
        message: errorMessage,
        color: 'red',
        autoClose: 7000,
      });
      if (onError) onError(errorMessage);
    },
  });

  const handleDownloadTemplate = useCallback(() => {
    // Generate Excel file with proper formatting
    const workbook = XLSX.utils.book_new();

    // Create worksheet data with headers and example row
    const worksheetData = [
      CSV_TEMPLATE_HEADERS,
      CSV_TEMPLATE_EXAMPLE,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 25 }, // Nom complet
      { wch: 15 }, // Profession
      { wch: 15 }, // Zone
      { wch: 20 }, // Numéro de téléphone
      { wch: 10 }, // WhatsApp
      { wch: 40 }, // Description
      { wch: 30 }, // Facebook
      { wch: 30 }, // TikTok
      { wch: 30 }, // Instagram
    ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Artisans");

    // Generate Excel file and download
    XLSX.writeFile(workbook, "template-artisans.xlsx");
  }, []);

  const parseExcelFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Get first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON with header row (returns array of arrays)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        }) as string[][];

        if (jsonData.length < 2) {
          throw new Error("Le fichier Excel doit contenir au moins une ligne d'en-tête et une ligne de données");
        }

        // Get headers from first row and normalize them
        const rawHeaders = (jsonData[0] as string[]).map((h) => String(h).trim());
        const normalizedHeaders = rawHeaders.map(normalizeHeader);
        const requiredHeaders = CSV_TEMPLATE_HEADERS.map(normalizeHeader);
        const missingHeaders = requiredHeaders.filter((h) => !normalizedHeaders.includes(h));

        if (missingHeaders.length > 0) {
          throw new Error(
            `En-têtes manquants: ${missingHeaders.join(", ")}. Veuillez utiliser le modèle fourni.`
          );
        }

        // Parse data rows (skip header row)
        const parsedData: ParsedArtisan[] = jsonData.slice(1).map((row, index) => {
          const rowArray = row as string[];
          const artisan: ParsedArtisan = {
            "Nom complet": String(rowArray[normalizedHeaders.indexOf("Nom complet")] || "").trim(),
            Profession: String(rowArray[normalizedHeaders.indexOf("Profession")] || "").trim(),
            Zone: String(rowArray[normalizedHeaders.indexOf("Zone")] || "").trim(),
            "Numéro de téléphone": String(rowArray[normalizedHeaders.indexOf("Numéro de téléphone")] || "").trim(),
            WhatsApp: String(rowArray[normalizedHeaders.indexOf("WhatsApp")] || "").trim(),
            Description: String(rowArray[normalizedHeaders.indexOf("Description")] || "").trim(),
            Facebook: String(rowArray[normalizedHeaders.indexOf("Facebook")] || "").trim(),
            TikTok: String(rowArray[normalizedHeaders.indexOf("TikTok")] || "").trim(),
            Instagram: String(rowArray[normalizedHeaders.indexOf("Instagram")] || "").trim(),
            _rowIndex: index + 2, // +2 because index 0 is header, so first data row is 2
          };
          return artisan;
        }).filter((artisan) => {
          // Filter out completely empty rows
          return artisan["Nom complet"] || artisan.Profession || artisan.Zone;
        });

        if (parsedData.length === 0) {
          throw new Error("Le fichier Excel ne contient aucune donnée valide");
        }

        // Validate data
        const validationErrors = validateParsedData(parsedData);
        const isValid = validationErrors.length === 0 && parsedData.length > 0;

        setCsvState({
          file,
          error: isValid ? null : `Erreurs de validation trouvées dans ${validationErrors.length} ligne(s)`,
          isValid,
          parsedData,
          validationErrors,
        });

        if (!isValid && onError) {
          onError(`Erreurs de validation trouvées dans ${validationErrors.length} ligne(s)`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erreur lors de la lecture du fichier Excel";
        setCsvState({
          file: null,
          error: errorMessage,
          isValid: false,
          parsedData: [],
          validationErrors: [],
        });
        if (onError) onError(errorMessage);
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onError]);

  const parseAndValidateCSV = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            const parseErrors = results.errors
              .filter((err) => err.type === "Quotes" || err.type === "Delimiter")
              .map((err) => `Ligne ${err.row}: ${err.message}`)
              .join(", ");

            if (parseErrors) {
              throw new Error(`Erreurs de parsing CSV: ${parseErrors}`);
            }
          }

          const data = results.data as Record<string, string>[];

          if (data.length === 0) {
            throw new Error("Le fichier CSV ne contient aucune donnée");
          }

          // Check headers (normalize to handle asterisks)
          const rawHeaders = results.meta.fields || [];
          const normalizedHeaders = rawHeaders.map(normalizeHeader);
          const requiredHeaders = CSV_TEMPLATE_HEADERS.map(normalizeHeader);
          const missingHeaders = requiredHeaders.filter((h) => !normalizedHeaders.includes(h));

          if (missingHeaders.length > 0) {
            throw new Error(
              `En-têtes manquants: ${missingHeaders.join(", ")}. Veuillez utiliser le modèle fourni.`
            );
          }

          // Create a mapping from normalized headers to raw headers for data access
          const headerMap = new Map<string, string>();
          rawHeaders.forEach((rawHeader, index) => {
            const normalized = normalizeHeader(rawHeader);
            if (!headerMap.has(normalized)) {
              headerMap.set(normalized, rawHeader);
            }
          });

          // Parse data rows
          const parsedData: ParsedArtisan[] = data.map((row, index) => {
            const artisan: ParsedArtisan = {
              "Nom complet": (row[headerMap.get("Nom complet") || "Nom complet"] || "").trim(),
              Profession: (row[headerMap.get("Profession") || "Profession"] || "").trim(),
              Zone: (row[headerMap.get("Zone") || "Zone"] || "").trim(),
              "Numéro de téléphone": (row[headerMap.get("Numéro de téléphone") || "Numéro de téléphone"] || "").trim(),
              WhatsApp: (row[headerMap.get("WhatsApp") || "WhatsApp"] || "").trim(),
              Description: (row[headerMap.get("Description") || "Description"] || "").trim(),
              Facebook: (row[headerMap.get("Facebook") || "Facebook"] || "").trim(),
              TikTok: (row[headerMap.get("TikTok") || "TikTok"] || "").trim(),
              Instagram: (row[headerMap.get("Instagram") || "Instagram"] || "").trim(),
              _rowIndex: index + 2, // +2 because index 0 is header, so first data row is 2
            };
            return artisan;
          });

          // Validate data
          const validationErrors = validateParsedData(parsedData);
          const isValid = validationErrors.length === 0 && parsedData.length > 0;

          setCsvState({
            file,
            error: isValid ? null : `Erreurs de validation trouvées dans ${validationErrors.length} ligne(s)`,
            isValid,
            parsedData,
            validationErrors,
          });

          if (!isValid && onError) {
            onError(`Erreurs de validation trouvées dans ${validationErrors.length} ligne(s)`);
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Erreur lors de la lecture du fichier CSV";
          setCsvState({
            file: null,
            error: errorMessage,
            isValid: false,
            parsedData: [],
            validationErrors: [],
          });
          if (onError) onError(errorMessage);
        }
      },
      error: (error) => {
        const errorMessage = `Erreur lors de la lecture du fichier CSV: ${error.message}`;
        setCsvState({
          file: null,
          error: errorMessage,
          isValid: false,
          parsedData: [],
          validationErrors: [],
        });
        if (onError) onError(errorMessage);
      },
    });
  }, [onError]);

  const handleCsvFileSelect = useCallback(
    (file: File | null) => {
      if (!file) {
        setCsvState({
          file: null,
          error: null,
          isValid: false,
          parsedData: [],
          validationErrors: [],
        });
        setShowPreview(false);
        return;
      }

      // Validate file type
      const fileName = file.name.toLowerCase();
      const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
      const isCsv = fileName.endsWith(".csv");

      if (!isExcel && !isCsv) {
        const error = "Le fichier doit être au format Excel (.xlsx, .xls) ou CSV (.csv)";
        setCsvState({
          file: null,
          error,
          isValid: false,
          parsedData: [],
          validationErrors: [],
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
          parsedData: [],
          validationErrors: [],
        });
        if (onError) onError(error);
        return;
      }

      // Parse and validate based on file type
      if (isExcel) {
        parseExcelFile(file);
      } else {
        parseAndValidateCSV(file);
      }
    },
    [onError, parseAndValidateCSV, parseExcelFile]
  );

  const handleCsvSubmit = useCallback(async () => {
    if (!csvState.file || !csvState.isValid || csvState.parsedData.length === 0) return;

    setIsProcessing(true);
    setBatchResult(null);

    try {
      // Transform parsed data to API format
      const apiPayload = transformParsedDataToApiFormat(csvState.parsedData, isAdmin());

      // Submit batch
      await batchMutation.mutateAsync({
        payload: apiPayload,
        jwt,
      });
    } catch (error) {
      // Error handled in onError callback
    } finally {
      setIsProcessing(false);
    }
  }, [csvState.file, csvState.isValid, csvState.parsedData, batchMutation, jwt, isAdmin]);

  const handleDownloadErrorReport = useCallback(() => {
    if (!batchResult || !csvState.parsedData.length) return;

    // Get failed rows based on batch results
    const failedIndices = new Set(
      batchResult.results
        .filter((r) => !r.success)
        .map((r) => r.index)
    );

    const failedRows = csvState.parsedData.filter((row) => {
      const rowIndex = row._rowIndex || 0;
      return failedIndices.has(rowIndex);
    });

    if (failedRows.length > 0) {
      generateErrorReport(failedRows, batchResult);
    }
  }, [batchResult, csvState.parsedData]);

  // Determine if we should show the upload sections (hide during/after submission)
  const showUploadSections = !isProcessing && !batchResult;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FormArea className="gap-6">
          {showUploadSections && (
            <>
              <InfoBox title="Instructions pour l'upload en lot" variant="blue">
                <ol className="space-y-2 list-decimal list-inside text-sm">
                  <li>Téléchargez le modèle Excel (.xlsx) ci-dessous</li>
                  <li>Ouvrez le fichier avec Excel ou Google Sheets</li>
                  <li>Remplissez le fichier avec les informations des artisans (une ligne par artisan)</li>
                  <li>Enregistrez le fichier (Excel ou CSV)</li>
                  <li>Uploadez le fichier rempli (Excel ou CSV accepté)</li>
                  <li>Vérifiez l'aperçu des données avant de soumettre</li>
                </ol>
              </InfoBox>

              {/* Format Example */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Format attendu:
                </h4>
                <div className="overflow-x-auto -mx-4 px-4">
                  <div className="min-w-full inline-block">
                    <Table striped highlightOnHover withTableBorder withColumnBorders className="min-w-full">
                      <Table.Thead>
                        <Table.Tr>
                          {CSV_TEMPLATE_HEADERS.map((header) => {
                            const hasAsterisk = header.endsWith(" *");
                            const headerText = hasAsterisk ? header.slice(0, -2) : header;
                            return (
                              <Table.Th key={header} className="text-xs whitespace-nowrap">
                                {headerText}
                                {hasAsterisk && <span className="text-red-500 ml-0.5">*</span>}
                              </Table.Th>
                            );
                          })}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        <Table.Tr>
                          {CSV_TEMPLATE_EXAMPLE.map((value, idx) => (
                            <Table.Td key={idx} className="text-xs whitespace-nowrap">
                              {value || <span className="text-gray-400">(optionnel)</span>}
                            </Table.Td>
                          ))}
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  💡 Chaque ligne représente un artisan. Les colonnes avec "<span className="text-red-500">*</span>" sont obligatoires à remplir.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Étape 1: Télécharger le modèle Excel
                </label>
                <button
                  onClick={handleDownloadTemplate}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer",
                    "bg-white dark:bg-gray-800 border-2 border-teal-500",
                    "text-teal-600 dark:text-teal-400 font-semibold",
                    "hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors",
                    "focus:outline-none focus:ring-teal-500 focus:ring-offset-2"
                  )}
                  aria-label="Télécharger le modèle Excel"
                >
                  <Download className="h-5 w-5" />
                  Télécharger le modèle Excel (.xlsx)
                </button>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 Le modèle s'ouvre avec les colonnes correctement formatées dans Excel ou Google Sheets
                </p>
              </div>

              <FileUploadArea
                onFileSelect={handleCsvFileSelect}
                file={csvState.file}
                error={csvState.error}
                label="Étape 2: Uploader votre fichier rempli (Excel ou CSV)"
                accept=".xlsx,.xls,.csv"
                maxSize={MAX_FILE_SIZE}
              />
            </>
          )}

          {/* Validation Errors - only show before submission */}
          {showUploadSections && csvState.validationErrors.length > 0 && (
            <Alert
              icon={<AlertCircle className="h-4 w-4" />}
              title="Erreurs de validation"
              color="red"
              variant="light"
            >
              <div className="space-y-2">
                {csvState.validationErrors.map((error, idx) => (
                  <div key={idx} className="text-sm">
                    <strong>Ligne {error.row}:</strong> {error.errors.join(", ")}
                  </div>
                ))}
              </div>
            </Alert>
          )}

          {/* Batch Results */}
          {batchResult && (
            <Alert
              icon={batchResult.failed === 0 ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              title={batchResult.failed === 0 ? "Import réussi" : "Import partiel"}
              color={batchResult.failed === 0 ? "green" : "orange"}
              variant="light"
            >
              <div className="space-y-3">
                <div className="text-sm">
                  <strong>{batchResult.created}</strong> artisan(s) créé(s) sur <strong>{batchResult.total}</strong>
                  {batchResult.failed > 0 && (
                    <span className="text-orange-600 dark:text-orange-400">
                      {" "}({batchResult.failed} échec(s))
                    </span>
                  )}
                </div>

                {batchResult.failed > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Détails des erreurs:</div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {batchResult.results
                        .filter((r) => !r.success)
                        .map((result, idx) => (
                          <div key={idx} className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            <strong>Ligne {result.index}:</strong> {result.errorMessage || result.errors?.join(", ")}
                          </div>
                        ))}
                    </div>
                    <Button
                      leftSection={<FileDown className="h-4 w-4" />}
                      onClick={handleDownloadErrorReport}
                      variant="light"
                      color="orange"
                      size="sm"
                      className="mt-2"
                    >
                      Voir les lignes en erreur (XLS)
                    </Button>
                  </div>
                )}
              </div>
            </Alert>
          )}

          {/* Preview Section */}
          {csvState.parsedData.length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {csvState.parsedData.length} artisan(s) trouvé(s)
                  </h4>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Masquer l'aperçu
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Afficher l'aperçu
                    </>
                  )}
                </button>
              </div>

              {showPreview && !isProcessing && !batchResult && (
                <div className="overflow-x-auto max-h-64 overflow-y-auto -mx-4 px-4">
                  <div className="min-w-full inline-block">
                    <Table striped highlightOnHover withTableBorder withColumnBorders className="min-w-full">
                      <Table.Thead>
                        <Table.Tr>
                          {CSV_TEMPLATE_HEADERS.map((header) => {
                            const hasAsterisk = header.endsWith(" *");
                            const headerText = hasAsterisk ? header.slice(0, -2) : header;
                            // Shorten header names for preview
                            const shortHeader = headerText === "Nom complet" ? "Nom" :
                              headerText === "Numéro de téléphone" ? "Téléphone" :
                                headerText;
                            return (
                              <Table.Th key={header} className="text-xs whitespace-nowrap">
                                {shortHeader}
                                {hasAsterisk && <span className="text-red-500 ml-0.5">*</span>}
                              </Table.Th>
                            );
                          })}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {csvState.parsedData.slice(0, 10).map((artisan, idx) => (
                          <Table.Tr key={idx}>
                            <Table.Td className="text-xs whitespace-nowrap">{artisan["Nom complet"]}</Table.Td>
                            <Table.Td className="text-xs whitespace-nowrap">{artisan.Profession}</Table.Td>
                            <Table.Td className="text-xs whitespace-nowrap">{artisan.Zone}</Table.Td>
                            <Table.Td className="text-xs whitespace-nowrap">{artisan["Numéro de téléphone"]}</Table.Td>
                            <Table.Td className="text-xs whitespace-nowrap">
                              {artisan.WhatsApp && artisan.WhatsApp.toLowerCase() === "oui" ? (
                                <Badge size="xs" color="green">
                                  Oui
                                </Badge>
                              ) : artisan.WhatsApp && artisan.WhatsApp.toLowerCase() === "non" ? (
                                <Badge size="xs" color="gray">
                                  Non
                                </Badge>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </Table.Td>
                            <Table.Td className="text-xs whitespace-nowrap max-w-xs truncate" title={artisan.Description}>
                              {artisan.Description || <span className="text-gray-400">-</span>}
                            </Table.Td>
                            <Table.Td className="text-xs whitespace-nowrap max-w-xs truncate" title={artisan.Facebook}>
                              {artisan.Facebook || <span className="text-gray-400">-</span>}
                            </Table.Td>
                            <Table.Td className="text-xs whitespace-nowrap max-w-xs truncate" title={artisan.TikTok}>
                              {artisan.TikTok || <span className="text-gray-400">-</span>}
                            </Table.Td>
                            <Table.Td className="text-xs whitespace-nowrap max-w-xs truncate" title={artisan.Instagram}>
                              {artisan.Instagram || <span className="text-gray-400">-</span>}
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </div>
                  {csvState.parsedData.length > 10 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      ... et {csvState.parsedData.length - 10} autre(s) artisan(s)
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
      </FormArea>

      <ButtonsArea>
        {batchResult && (
          <Button
            onClick={() => {
              setCsvState({
                file: null,
                error: null,
                isValid: false,
                parsedData: [],
                validationErrors: [],
              });
              setShowPreview(false);
              setBatchResult(null);
            }}
            variant="light"
            size="md"
            color="gray"
            className="font-semibold"
          >
            Réinitialiser et recommencer
          </Button>
        )}
        {showUploadSections && (
          <div className="flex gap-4">
            <Button
              onClick={() => onPrevious?.()}
              variant="outline"
              size="md"
              className="font-semibold"
            >
              Retour
            </Button>
             <Button
            onClick={handleCsvSubmit}
            disabled={!csvState.isValid || isProcessing || csvState.parsedData.length === 0}
            size="md"
            color="teal"
            className="font-semibold transition-colors"
            loading={isProcessing}
            aria-label="Soumettre le fichier"
          >
            {isProcessing
              ? "Traitement en cours..."
              : `Soumettre ${csvState.parsedData.length > 0 ? `${csvState.parsedData.length} artisan(s)` : "le fichier"}`}
          </Button>
          </div>
         
        )}
      </ButtonsArea>
    </div>
  );
}
