'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Transfer } from '@/types/orders';
import getTransfersToday from '@/services/getTransfersToday';
import TransferDetailModal from '@/components/molecule/TransferDetailModal/TransferDetailModal';
import DynamicTable from '@/components/atoms/DynamicTable/DynamicTable';
import markTransferArrived from '@/services/markTransferArrived'; // default import
import { toast } from 'react-toastify';

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

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'draft': return 'Borrador';
      case 'confirmed': return 'Confirmado';
      case 'in_progress': return 'En progreso';
      case 'done': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return state;
    }
  };

  const columns = [
    { key: "transfer_id", label: "ID Traslado" },
    { key: "name", label: "Nombre" },
    { key: "machine_name", label: "Máquina" },
    { key: "state", label: "Estado", render: (v: string) => getStateLabel(v) },
    { key: "start_date", label: "Fecha Inicio", render: (v: string) => v ? new Date(v).toLocaleDateString("es-ES") : "-" },
    { key: "end_date", label: "Fecha Fin", render: (v: string) => v ? new Date(v).toLocaleDateString("es-ES") : "-" },
    { key: "duration_days", label: "Duración (días)" },
  ];

  const actionButtons = [
    {
      label: "Ver detalle",
      className: "table-action-button",
      onClick: (item: any) => setSelectedTransferId(item.transfer_id),
    },
    {
      label: "Marcar completado",
      className: "table-action-button table-action-button--primary",
      onClick: async (item: any) => {
        try {
          const token = getToken();
          if (!token) {
            toast.error("Token no disponible");
            return;
          }
          const result = await markTransferArrived(token, item.transfer_id);
          if (result.success) {
            toast.success("Traslado marcado como completado");
            fetchTransfers();
          } else {
            toast.error(result.message || "Error al completar traslado");
          }
        } catch (err) {
          console.error("Error al completar traslado:", err);
          toast.error("Error inesperado al completar traslado");
        }
      },
    },
  ];

  return (
    <>
      <DynamicTable
        title="Tareas asignadas de hoy"
        items={transfers}
        isLoading={loading}
        error={error}
        searchValue={""}
        columns={columns}
        actionButtons={actionButtons}
      />

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
