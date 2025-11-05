"use client"
import { useState, ReactNode } from 'react';

export interface ModalHookProps {
  title?: string;
  subtitle?: string;
  body: ReactNode;
  size?: string;
  withCloseButton?: boolean;
  asChild?: boolean;
  modalWrapperClassName?: string;
  modalContentClassName?: string;
  onClose?: () => void;
}

export const useModal = () => {
  const [opened, setOpened] = useState(false);
  const [modalProps, setModalProps] = useState<ModalHookProps | null>(null);

  const openModal = (props: ModalHookProps) => {
    setModalProps(props);
    setOpened(true);
  };

  const closeModal = () => {
    if (modalProps?.onClose) {
      modalProps.onClose();
    }
    setOpened(false);
    // Optional: Add a timeout to clear modalProps after animation completes
    setTimeout(() => {
      setModalProps(null);
    }, 300);
  };

  return {
    opened,
    modalProps,
    openModal,
    closeModal,
  };
}; 