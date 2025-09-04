'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ConfirmationContextType {
  confirm: (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmationDialogProps | null>(null);

  const confirm = (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel || 'Confirmar',
        cancelLabel: options.cancelLabel || 'Cancelar',
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        }
      });
    });
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">{dialog.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{dialog.message}</p>
            </div>
            <div className="px-5 py-3 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={dialog.onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500"
              >
                {dialog.cancelLabel}
              </button>
              <button
                onClick={dialog.onConfirm}
                className="px-4 py-2 text-sm font-medium text-white 
                bg-red-600 border border-transparent rounded-md 
                hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
}
