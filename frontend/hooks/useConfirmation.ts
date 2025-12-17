import { useState, useCallback } from 'react';

export interface ConfirmationOptions {
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationOptions | null;
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    options: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const openConfirmation = useCallback((options: ConfirmationOptions) => {
    setState({
      isOpen: true,
      options,
    });
  }, []);

  const closeConfirmation = useCallback(() => {
    setState({
      isOpen: false,
      options: null,
    });
    setIsLoading(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!state.options) return;

    try {
      setIsLoading(true);
      await state.options.onConfirm();
      closeConfirmation();
    } catch (error) {
      // Error handling should be done in the onConfirm callback
      // We still close the modal to allow the error to be displayed
      closeConfirmation();
    } finally {
      setIsLoading(false);
    }
  }, [state.options, closeConfirmation]);

  const handleCancel = useCallback(() => {
    if (state.options?.onCancel) {
      state.options.onCancel();
    }
    closeConfirmation();
  }, [state.options, closeConfirmation]);

  return {
    isOpen: state.isOpen,
    options: state.options,
    isLoading,
    openConfirmation,
    closeConfirmation,
    handleConfirm,
    handleCancel,
  };
}

