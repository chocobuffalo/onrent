import { useState, useCallback } from 'react';

interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ConfirmationConfig>({
    title: '',
    message: '',
    confirmText: 'CONFIRMAR',
    cancelText: 'CANCELAR',
    variant: 'danger'
  });
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((confirmationConfig: ConfirmationConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig({
        confirmText: 'CONFIRMAR',
        cancelText: 'CANCELAR',
        variant: 'danger',
        ...confirmationConfig
      });
      setResolvePromise(() => resolve);
      setLoading(false);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsOpen(false);
    setLoading(false);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    setIsOpen(false);
    setLoading(false);
  }, [resolvePromise]);

  const setModalLoading = useCallback((loadingState: boolean) => {
    setLoading(loadingState);
  }, []);

  const modalProps = {
    isOpen,
    loading,
    ...config,
    onConfirm: handleConfirm,
    onCancel: handleCancel
  };

  return {
    confirm,
    modalProps,
    setModalLoading
  };
};