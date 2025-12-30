import { cn } from '@/app/lib/utils';
import React, { ReactNode } from 'react';

interface StepperProps {
  steps: string[] | { label: string; icon: ReactNode }[];
  currentStep: number;
  className?: string;
}

export default function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div
      className={cn('flex items-center overflow-y-hidden w-full flex-row gap-4 py-3', className)}
    >
      {steps.map((step, index) => (
        <>
          <div
            key={index}
            className='flex items-center gap-2'
          >
            <span
              className={cn(
                'h-3 w-3 rounded-full',
                currentStep == index + 1 && 'bg-teal-500',
                currentStep > index + 1 && 'bg-teal-500',
                currentStep < index + 1 && 'border-2 border-slate-400',
              )}
            />

            <p
              className={cn(
                `font-medium text-sm max-md:w-max capitalize`,
                currentStep == index + 1 ? 'text-teal-500' : 'text-slate-500',
              )}
            >
              {typeof step === 'string' ? step : step.label}
            </p>
          </div>

          {index !== steps.length - 1 && (
            <span
              className={cn(
                'min-w-8 h-0.5 rounded-xxs',
                currentStep >= index + 1 ? 'bg-teal-500' : 'bg-slate-200',
              )}
            ></span>
          )}
        </>
      ))}
    </div>
  );
}
