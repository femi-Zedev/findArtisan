"use client";

import { Button, Switch } from "@mantine/core";
import { Plus, X } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { PhoneInput } from "../ui/PhoneInput";
import type { UseFormReturnType } from "@mantine/form";
import type { AddArtisanFormValues, PhoneNumber } from "@/app/lib/utils/artisan-form";

interface PhoneNumbersSectionProps {
  form: UseFormReturnType<AddArtisanFormValues>;
}

export function PhoneNumbersSection({ form }: PhoneNumbersSectionProps) {
  const addPhoneNumber = () => {
    if (form.values.phoneNumbers.length < 4) {
      form.insertListItem("phoneNumbers", { number: "", isWhatsApp: false });
    }
  };

  const removePhoneNumber = (index: number) => {
    if (form.values.phoneNumbers.length > 1) {
      form.removeListItem("phoneNumbers", index);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {form.values.phoneNumbers.map((phone, index) => (
        <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PhoneInput
            label="Numéro de téléphone (ajoutez 01 pour le Bénin)"
            placeholder="96 09 69 69"
            required
            className="flex-1"
            value={form.values.phoneNumbers[index].number}
            onChange={(value) => form.setFieldValue(`phoneNumbers.${index}.number`, value || '')}
            error={form.errors[`phoneNumbers.${index}.number`] as string | undefined}
          />
          <div className="flex items-center gap-3 mt-8">
            <Switch
              label="Numéro dispo sur WhatsApp ?"
              size="md"
              classNames={{
                label: "text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap",
                root: "flex items-center gap-2",
              }}
              {...form.getInputProps(`phoneNumbers.${index}.isWhatsApp`, {
                type: "checkbox",
              })}
            />
            {form.values.phoneNumbers.length > 1 && (
              <button
                type="button"
                onClick={() => removePhoneNumber(index)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                )}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
      {form.values.phoneNumbers.length < 4 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftSection={<Plus size={16} />}
          onClick={addPhoneNumber}
          className="self-start border-teal-500 text-teal-500 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20"
        >
          Ajouter un autre numéro
        </Button>
      )}
      {form.errors.phoneNumbers && (
        <span className="text-xs text-red-500">{form.errors.phoneNumbers as string}</span>
      )}
    </div>
  );
}

