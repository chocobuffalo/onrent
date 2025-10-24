"use client";

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { TransferDetail } from '@/types/orders';
import getTransferDetail from '@/services/getTransferDetail';
import markTransferArrived from '@/services/markTransferArrived';
import { ImSpinner8 } from "react-icons/im";
import { toast } from 'react-toastify';
import "./TransferDetailModal.scss";

interface TransferDetailModalProps {
  transferId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const TransferDetailModal = ({ transferId, onClose, onSuccess }: TransferDetailModalProps) => {
  const { data: session } = useSession();
  const [transfer, setTransfer] = useState<TransferDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  const token = (session as any)?.accessToken || (session as any)?.user?.accessToken || 
                localStorage.getItem("api_access_token") || "";
  
  const hasFetched = useRef(false);

  const fetchDetail = async () => {
    if (!token) {
      setError('No se encontró token de autenticación');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getTransferDetail(token, transferId);
      
      if (!result.success) {
        setError(result.message || 'Error al cargar el detalle');
        return;
      }
      
      setTransfer(result.data || null);
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al cargar el detalle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (transferId) {
      document.body.style.overflow = 'hidden';
      
      // ✅ Fetch solo una vez
      if (!hasFetched.current) {
        hasFetched.current = true;
        fetchDetail();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [transferId]); // Solo depende de transferId

  const handleComplete = async () => {
    if (!transfer || transfer.state !== 'in_progress') {
      toast.warning('Solo se pueden completar traslados en estado "En progreso"');
      return;
    }

    setCompleting(true);
    
    try {
      if (!token) {
        toast.error('No se encontró token de autenticación');
        setCompleting(false);
        return;
      }
      
      const result = await markTransferArrived(token, transferId);
      
      if (!result.success) {
        toast.error(result.message || 'Error al completar el traslado');
        setCompleting(false);
        return;
      }
      
      toast.success(result.message || 'Traslado marcado como completado exitosamente');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error inesperado:', err);
      toast.error('Error inesperado al completar el traslado');
    } finally {
      setCompleting(false);
    }
  };

  const getStateLabel = (state: string) => {
    const stateMap: { [key: string]: string } = {
      'draft': 'Borrador',
      'confirmed': 'Confirmado',
      'in_progress': 'En progreso',
      'done': 'Completado',
      'cancelled': 'Cancelado'
    };
    return stateMap[state] || state;
  };

  const getStateClass = (state: string) => {
    const classMap: { [key: string]: string } = {
      'draft': 'transfer-detail-modal__status--draft',
      'confirmed': 'transfer-detail-modal__status--confirmed',
      'in_progress': 'transfer-detail-modal__status--in-progress',
      'done': 'transfer-detail-modal__status--done',
      'cancelled': 'transfer-detail-modal__status--cancelled'
    };
    return `transfer-detail-modal__status ${classMap[state] || 'transfer-detail-modal__status--draft'}`;
  };

  // ✅ CAMBIO CRÍTICO: Mostrar modal INMEDIATAMENTE, no esperar datos
  if (!transferId) return null;

  const modalContent = (
    <div 
      className="transfer-detail-modal__overlay"
      onClick={onClose}
    >
      <div 
        className="transfer-detail-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Siempre visible */}
        <div className="transfer-detail-modal__header">
          <div className="transfer-detail-modal__header-info">
            <h2>Detalle del Traslado #{transferId}</h2>
          </div>
          <button 
            className="transfer-detail-modal__header-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>
        
        {/* Body */}
        <div className="transfer-detail-modal__body">
          
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <ImSpinner8 className="h-8 w-8 animate-spin text-[#EA6300]" />
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Content - Solo mostrar cuando tenga datos */}
          {!loading && !error && transfer && (
            <>
              {/* Información principal */}
              <div className="transfer-detail-modal__main-info">
                <div className="transfer-detail-modal__main-info-item">
                  <div className="label">ID Orden</div>
                  <p className="value value--large value--accent">{transfer.order_id}</p>
                </div>
                <div className="transfer-detail-modal__main-info-item">
                  <div className="label">Nombre</div>
                  <p className="value">{transfer.name || 'No especificado'}</p>
                </div>
                <div className="transfer-detail-modal__main-info-item">
                  <div className="label">Estado</div>
                  <span className={getStateClass(transfer.state)}>
                    {getStateLabel(transfer.state)}
                  </span>
                </div>
                <div className="transfer-detail-modal__main-info-item">
                  <div className="label">Duración</div>
                  <p className="value value--large value--accent">
                    {transfer.duration_days || 0} días
                  </p>
                </div>
              </div>

              {/* Información de la Máquina */}
              <div className="transfer-detail-modal__section">
                <h3 className="transfer-detail-modal__section-title">
                  Información de la Máquina
                </h3>
                <div className="transfer-detail-modal__machine-info">
                  <div className="transfer-detail-modal__machine-info-grid">
                    <div className="transfer-detail-modal__machine-info-item">
                      <div className="field-label">Máquina</div>
                      <p className="field-value">
                        {transfer.machine_name || 'No especificada'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fechas y Ubicaciones */}
              <div className="transfer-detail-modal__section">
                <h3 className="transfer-detail-modal__section-title">
                  Fechas y Ubicaciones
                </h3>
                <div className="transfer-detail-modal__dates-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Origen</th>
                        <th>Destino</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {transfer.start_date 
                            ? new Date(transfer.start_date).toLocaleDateString('es-ES') 
                            : 'No especificada'}
                        </td>
                        <td>
                          {transfer.end_date 
                            ? new Date(transfer.end_date).toLocaleDateString('es-ES') 
                            : 'No especificada'}
                        </td>
                        <td>{transfer.origin || 'No especificado'}</td>
                        <td>{transfer.destination || 'No especificado'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="transfer-detail-modal__section">
                <h3 className="transfer-detail-modal__section-title">
                  Información de Contacto
                </h3>
                <div className="transfer-detail-modal__contact-info">
                  <div className="transfer-detail-modal__contact-info-grid">
                    <div className="transfer-detail-modal__contact-info-item">
                      <div className="field-label">Proveedor</div>
                      <p className="field-value">
                        {transfer.provider_name || 'No especificado'}
                      </p>
                    </div>
                    <div className="transfer-detail-modal__contact-info-item">
                      <div className="field-label">Teléfono Proveedor</div>
                      <p className="field-value">
                        {transfer.provider_phone || 'No especificado'}
                      </p>
                    </div>
                    <div className="transfer-detail-modal__contact-info-item">
                      <div className="field-label">Cliente</div>
                      <p className="field-value">
                        {transfer.client_name || 'No especificado'}
                      </p>
                    </div>
                    <div className="transfer-detail-modal__contact-info-item">
                      <div className="field-label">Teléfono Cliente</div>
                      <p className="field-value">
                        {transfer.client_phone || 'No especificado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de acción */}
              {transfer.state === 'in_progress' && (
                <div className="transfer-detail-modal__actions">
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="transfer-detail-modal__action-button transfer-detail-modal__action-button--primary"
                  >
                    {completing ? (
                      <>
                        <ImSpinner8 className="animate-spin mr-2" />
                        Procesando...
                      </>
                    ) : (
                      'Marcar como Completado'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default TransferDetailModal;
