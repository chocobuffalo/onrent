'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { TransferDetail } from '@/types/orders';
import getTransferDetail from '@/services/getTransferDetail';
import markTransferArrived from '@/services/markTransferArrived';
import { X } from 'lucide-react';

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

  const getToken = useCallback(() => {
    const nextAuthToken = (session as any)?.accessToken || (session as any)?.user?.accessToken;
    const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem("api_access_token") : null;
    return nextAuthToken || localStorageToken || '';
  }, [session]);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        setError('No se encontró token de autenticación');
        setLoading(false);
        return;
      }
      
      const result = await getTransferDetail(token, transferId);
      
      if (!result.success) {
        setError(result.message || 'Error al cargar el detalle');
        setLoading(false);
        return;
      }
      
      setTransfer(result.data || null);
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al cargar el detalle');
    } finally {
      setLoading(false);
    }
  }, [getToken, transferId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleComplete = async () => {
    if (!transfer || transfer.state !== 'in_progress') {
      alert('Solo se pueden completar traslados en estado "En progreso"');
      return;
    }

    if (!confirm('¿Estás seguro de marcar este traslado como completado?')) {
      return;
    }

    setCompleting(true);
    
    try {
      const token = getToken();
      if (!token) {
        alert('No se encontró token de autenticación');
        setCompleting(false);
        return;
      }
      
      const result = await markTransferArrived(token, transferId);
      
      if (!result.success) {
        alert(result.message || 'Error al completar el traslado');
        setCompleting(false);
        return;
      }
      
      alert(result.message || 'Traslado marcado como completado exitosamente');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error inesperado:', err);
      alert('Error inesperado al completar el traslado');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Detalle del Traslado</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando detalle...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          )}

          {transfer && !loading && !error && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">ID Traslado</p>
                  <p className="text-lg">{transfer.transfer_id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">ID Orden</p>
                  <p className="text-lg">{transfer.order_id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Nombre</p>
                  <p className="text-lg">{transfer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Estado</p>
                  <p className="text-lg capitalize">{transfer.state.replace('_', ' ')}</p>
                </div>
              </div>

              <hr />

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Máquina</p>
                <p className="text-lg">{transfer.machine_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Fecha Inicio</p>
                  <p className="text-lg">{new Date(transfer.start_date).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Fecha Fin</p>
                  <p className="text-lg">{new Date(transfer.end_date).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Duración</p>
                  <p className="text-lg">{transfer.duration_days} días</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Renta Dinámica</p>
                  <p className="text-lg">${transfer.dynamic_rent.toLocaleString()}</p>
                </div>
              </div>

              <hr />

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Descripción del Trabajo</p>
                <p className="text-base">{transfer.work_description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Proyecto</p>
                  <p className="text-lg">{transfer.project}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Operador</p>
                  <p className="text-lg">{transfer.operator_name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Proveedor</p>
                  <p className="text-lg">{transfer.provider_name}</p>
                </div>
              </div>

              {transfer.state === 'in_progress' && (
                <div className="pt-4">
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    {completing ? 'Completando...' : 'Marcar como Completado'}
                  </button>
                </div>
              )}

              {transfer.state === 'done' && (
                <div className="pt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-semibold">✓ Traslado completado</p>
                </div>
              )}

              {transfer.state === 'draft' && (
                <div className="pt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800 font-semibold">Este traslado aún no ha iniciado</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferDetailModal;