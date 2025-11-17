// components/atoms/StatusMessage/StatusMessage.tsx

import React from 'react';

type StatusType = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

interface StatusMessageProps {
  status: StatusType;
  message: string;
  progress: number;
}

const StatusMessage = ({ status, message, progress }: StatusMessageProps) => {
  if (status === 'idle') {
    return null; // No mostrar nada si está inactivo
  }

  const isAlert = status === 'success' || status === 'error';
  const alertClass = status === 'success' ? 'alert alert-success' : 'alert alert-danger';
  const showProgressBar = status === 'uploading';
  const showNote = status === 'processing' || status === 'uploading';

  return (
    <div className="mt-3">
      {isAlert ? (
        // Mostrar mensaje final (éxito o error)
        <div className={alertClass}>{message}</div>
      ) : (
        // Mostrar estado de proceso
        <>
          <p><strong>Estado:</strong> {message}</p>
          
          {showProgressBar && (
            <div className="progress">
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${progress}%` }} 
                aria-valuenow={progress} 
                aria-valuemin={0} 
                aria-valuemax={100}
              >
                {progress}%
              </div>
            </div>
          )}
          
          {showNote && (
            <p className="text-muted small mt-2">...por favor no cierres esta ventana...</p>
          )}
        </>
      )}
    </div>
  );
};

export default StatusMessage;