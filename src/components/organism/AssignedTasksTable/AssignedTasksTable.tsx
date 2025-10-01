'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Transfer } from '@/types/orders';
import getTransfersToday from '@/services/getTransfersToday';
import { Eye } from 'lucide-react';
import TransferDetailModal from '@/components/molecule/TransferDetailModal/TransferDetailModal';

const AssignedTasksTable = () => {
  const { data: session } = useSession();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransferId, setSelectedTransferId] = useState<number | null>(null);

  const getToken = useCallback(() => {
    const nextAuthToken = (session as any)?.accessToken || (session as any)?.user?.accessToken;
    const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem("api_access_token") : null;
    return nextAuthToken || localStorageToken || '';
  }, [session]);

  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        setError('No se encontró token de autenticación');
        setLoading(false);
        return;
      }
      
      const result = await getTransfersToday(token);
      
      if (!result.success) {
        setError(result.message || 'Error al cargar las tareas');
        setLoading(false);
        return;
      }
      
      setTransfers(result.data || []);
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En progreso';
      case 'completed':
        return 'Completado';
      default:
        return state;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando tareas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchTransfers}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-gray-400 text-5xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hay tareas asignadas para hoy
        </h3>
        <p className="text-gray-600">
          Todas tus tareas están completadas o no tienes asignaciones pendientes.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ID Traslado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Máquina
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fecha Inicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fecha Fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Duración (días)
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transfers.map((transfer) => (
              <tr key={transfer.transfer_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transfer.transfer_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transfer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transfer.machine_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStateColor(transfer.state)}`}>
                    {getStateLabel(transfer.state)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(transfer.start_date).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(transfer.end_date).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {transfer.duration_days}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => setSelectedTransferId(transfer.transfer_id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                    title="Ver detalle"
                  >
                    <Eye size={20} />
                    <span className="text-xs">Ver</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTransferId && (
        <TransferDetailModal
          transferId={selectedTransferId}
          onClose={() => setSelectedTransferId(null)}
          onSuccess={fetchTransfers}
        />
      )}
    </>
  );
};

export default AssignedTasksTable;