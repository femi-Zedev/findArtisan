"use client"
import { useModal, ModalHookProps } from '@/hooks/useModal';
import React, { createContext, ReactNode, useContext } from 'react';
import { X } from 'lucide-react';
import { Modal } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { cn } from '@/app/lib/utils';

export interface ModalContextType {
  modalProps: ModalHookProps | null;
  openModal: (props: ModalHookProps) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export default function ModalProvider({ children }: { children: ReactNode }) {
  const { opened, modalProps, openModal, closeModal } = useModal();
  const sm = useMediaQuery('(max-width: 768px)');
  const { size = sm ? 'full' : 'md', modalWrapperClassName, modalContentClassName, withCloseButton = true, title, subtitle, body, asChild } = modalProps || {};

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalProps }}>
      <Modal
        closeOnEscape
        opened={opened}
        onClose={closeModal} // This ensures that the custom onClose is called
        radius={20}
        p={0}
        size={size}
        centered
        withCloseButton={false}
        zIndex={300}
        classNames={{
          content: "bg-white dark:bg-gray-900",
          body: "bg-white dark:bg-gray-900",
        }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div
          className={cn(
            'flex flex-col sm:min-w-[400px] h-full rounded-[20px]',
            'bg-white dark:bg-gray-900',
            modalWrapperClassName,
          )}
        >
          {modalProps &&
            (asChild ? (
              <div className="bg-white dark:bg-gray-900">{body}</div>
            ) : (
              <>
                <header className='flex justify-between items-start px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-[20px]'>
                  <hgroup>
                    <h4 className='text-2xl font-bold text-gray-700 dark:text-white'>{title}</h4>

                    {subtitle && <p className='text-sm text-gray-500 dark:text-gray-400 mt-1 font-normal'>{subtitle}</p>}
                  </hgroup>

                  {withCloseButton && (
                    <button
                      className='group bg-teal-100 hover:bg-teal-500 dark:bg-gray-800 dark:hover:bg-teal-600 p-2 rounded-full transition-colors'
                      onClick={() => closeModal()}
                    >
                      <X
                        size={16}
                        className='shrink-0 h-fit text-teal-500 group-hover:text-teal-50 dark:text-gray-400 dark:group-hover:text-white'
                      />
                    </button>
                  )}
                </header>

                <div className={cn('bg-white dark:bg-gray-900 h-full overflow-visible rounded-b-[20px]', modalContentClassName)}>
                  {body}
                </div>
              </>
            ))}
        </div>
      </Modal>

      {children}
    </ModalContext.Provider>
  );
}

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider');
  }
  return context;
}; 