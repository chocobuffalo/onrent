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

  // 👇 Flag para evitar hydration error
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
          {loading && <p>Cargando detalle...</p>}
          {error && <p className="text-red-600">{error}</p>}

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
                  <p className="text-lg">
                    {mounted && transfer.start_date ? new Date(transfer.start_date).toLocaleDateString('es-ES') : ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Fecha Fin</p>
                  <p className="text-lg">
                    {mounted && transfer.end_date ? new Date(transfer.end_date).toLocaleDateString('es-ES') : ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Duración</p>
                  <p className="text-lg">{transfer.duration_days} días</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Origen</p>
                  <p className="text-lg">{transfer.origin}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Destino</p>
                  <p className="text-lg">{transfer.destination}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Proveedor</p>
                  <p>{transfer.provider_name ?? '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Teléfono Proveedor</p>
                  <p>{transfer.provider_phone ?? '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Cliente</p>
                  <p>{transfer.client_name ?? '-'}</p>
                </div>
                <div>
                   <p className="text-sm font-semibold">Teléfono Cliente</p>
                   <p>{transfer.client_phone ?? '-'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferDetailModal;
