import React from 'react';
import { Button, Text } from '@mantine/core';
import { cn } from '@/app/lib/utils';
import { Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  title?: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger',
}: ConfirmationModalProps) {
  // Determine button color based on variant
  const getButtonColor = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700';
      case 'warning':
        return 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700';
      default:
        return 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700';
    }
  };

  return (
    <div className=''>
      <header className='px-6 py-4 border-b border-gray-200 dark:border-gray-800'>
        <h4 className='text-2xl font-semibold'>{title ?? 'Confirmation'}</h4>
      </header>
      <div className='px-6 py-4'>
        <p
          className='text-sm text-gray-600 dark:text-gray-400'
        >
          {message}
        </p>
      </div>
      <div className='pb-6 px-6 w-full flex gap-3'>
        <Button
          variant='default'
          onClick={onCancel}
          disabled={isLoading}
          size='md'
          radius='md'
          fullWidth
        >
          {cancelLabel}
        </Button>
        <button
          className={cn('btn-base rounded-md w-full justify-center text-white', getButtonColor())}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className='animate-spin mr-2 h-4 w-4' />}
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

