"use client";

import { Button } from "@mantine/core";
import { PropsWithChildren } from "react";
import { cn } from "@/app/lib/utils";
import { useDrawerContext } from "@/providers/drawer-provider";

export function ButtonsArea({
  onClose,
  children,
  className,
  hideCancel = false,
}: {
  onClose?: () => void;
  hideCancel?: boolean;
  className?: string;
} & PropsWithChildren) {
  const { closeDrawer } = useDrawerContext();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeDrawer();
    }
  };

  return (
    <div
      id="button-area"
      className={cn(
        "flex justify-between gap-4 py-4 px-6 w-full border-t border-slate-200 dark:border-gray-800 min-h-[84px] bg-white dark:bg-gray-900",
        className
      )}
    >
      {!hideCancel && (
        <Button
          color="gray"
          variant="default"
          size="md"
          type="button"
          onClick={handleClose}
        >
          Annuler
        </Button>
      )}
      <>{children}</>
    </div>
  );
}

export function FormArea({
  className,
  children,
}: { className?: string } & PropsWithChildren) {
  return (
    <div
      id="form-area"
      className={cn(
        "px-6 py-4 flex flex-col w-full h-full gap-4 overflow-y-auto bg-white dark:bg-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
}

