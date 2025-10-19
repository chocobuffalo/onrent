'use client';

import React, { useEffect } from 'react';
import './ConfirmationModal.scss';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'CONFIRMAR',
  cancelText = 'CANCELAR',
  onConfirm,
  onCancel,
  variant = 'danger',
  loading = false
}: ConfirmationModalProps) {
  
  // Manejar ESC y prevenir scroll del body
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !loading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel, loading]);

  // Renderizar icono según variante
  const renderIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <svg className="confirmation-modal__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="confirmation-modal__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="confirmation-modal__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return isOpen && (
    <div 
      className="confirmation-modal__overlay" 
      onClick={loading ? undefined : onCancel}
    >
      <div 
        className={`confirmation-modal confirmation-modal--${variant}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirmation-modal__header">
          <div className={`confirmation-modal__icon confirmation-modal__icon--${variant}`}>
            {renderIcon()}
          </div>
          <h3 className="confirmation-modal__title futura-font">
            {title}
          </h3>
          {!loading && (
            <button 
              type="button" 
              className="confirmation-modal__close-btn" 
              onClick={onCancel}
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        <div className="confirmation-modal__body">
          <p className="confirmation-modal__message lato-font">
            {message}
          </p>
        </div>

        <div className="confirmation-modal__footer">
          <button
            type="button"
            className="confirmation-modal__btn confirmation-modal__btn--secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="confirmation-modal__btn confirmation-modal__btn--primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'PROCESANDO...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
