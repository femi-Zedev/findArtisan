"use client";

import { useState } from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { AddArtisanForm } from "./forms/AddArtisan.form";
import { AddArtisanCsvForm } from "./forms/AddArtisanCsv.form";
import { ArtisanFeedbackForm } from "./forms/ArtisanFeedback.form";
import { InfoBox, MethodCard } from "./ui";

import { DrawerTitle } from "@/providers/drawer-provider";
import Stepper from "./ui/Stepper";
import { AddArtisanSelection } from "./forms/AddArtisanSelection";

export function AddArtisanHeader({ step }: { step: number }) {
  return (
    <div className='px-6 pt-4 pb-0 space-y-0.5 border-b border-slate-200 dark:border-gray-800'>
      <DrawerTitle title='Ajouter un artisan' />
      <Stepper
        currentStep={step}
        steps={['Ajout simple ou multiple', 'Informations sur l\'artisan', 'Expérience avec l\'artisan']}
      />
    </div>
  );
}



export function AddArtisan() {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<"form" | "csv" | null>(null);
  const [createdArtisanId, setCreatedArtisanId] = useState<number | null>(null);
  const [createdArtisanName, setCreatedArtisanName] = useState<string>("");

  const handleSelectMethod = (method: "form" | "csv") => {
    setSelectedMethod(method);
    setStep(2);
  };

  const handleArtisanCreated = (artisanId: number, artisanName: string) => {
    setCreatedArtisanId(artisanId);
    setCreatedArtisanName(artisanName);
    setStep(3);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AddArtisanHeader step={step} />

      {step === 1 && (
        <div className="flex-1 overflow-y-auto">
          <AddArtisanSelection onSelectMethod={handleSelectMethod} />
        </div>
      )}

      {step === 2 && selectedMethod === "form" && (
        <AddArtisanForm
          onPrevious={() => setStep(1)}
          onNext={(artisanId, artisanName) => {
            handleArtisanCreated(artisanId, artisanName);
          }}
        />
      )}

      {step === 2 && selectedMethod === "csv" && (
        <AddArtisanCsvForm onPrevious={() => setStep(1)} />
      )}

      {step === 3 && createdArtisanId && (
        <ArtisanFeedbackForm
          artisanId={createdArtisanId}
          artisanName={createdArtisanName}
          onPrevious={() => setStep(2)}
        />
      )}
    </div>
  );
}
