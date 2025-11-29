"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { Modal } from '@mantine/core';
import { useConfirmation } from '@/hooks/useConfirmation';
import ConfirmationModal from '@/app/_components/modals/ConfirmationModal';

export interface ConfirmationContextType {
  openConfirmation: (options: {
    message: string | React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
  }) => void;
  closeConfirmation: () => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | null>(null);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const {
    isOpen,
    options,
    isLoading,
    openConfirmation,
    closeConfirmation,
    handleConfirm,
    handleCancel,
  } = useConfirmation();

  return (
    <ConfirmationContext.Provider value={{ openConfirmation, closeConfirmation }}>
      <Modal
        opened={isOpen}
        onClose={handleCancel}
        closeOnEscape={!isLoading}
        closeOnClickOutside={!isLoading}
        withCloseButton={false}
        centered
        radius={16}
        size="sm"
        zIndex={400}
        classNames={{
          content: "bg-white dark:bg-gray-900",
          body: "bg-white dark:bg-gray-900 p-0",
        }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {options && (
          <ConfirmationModal
            message={options.message}
            confirmLabel={options.confirmLabel}
            cancelLabel={options.cancelLabel}
            variant={options.variant}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}
      </Modal>
      {children}
    </ConfirmationContext.Provider>
  );
}

export const useConfirmationContext = (): ConfirmationContextType => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmationContext must be used within ConfirmationProvider');
  }
  return context;
};

