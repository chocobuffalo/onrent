"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Transfer, ActionButton, TableColumn } from "@/types/orders";
import getTransfersToday from "@/services/getTransfersToday";
import markTransferArrived from "@/services/markTransferArrived";
import { toast } from "react-toastify";

export default function useAssignedTasksUI() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransferId, setSelectedTransferId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  
  const { data: session } = useSession();
  const token = (session as any)?.accessToken || (session as any)?.user?.accessToken || 
                localStorage.getItem("api_access_token") || "";
  
  const hasFetched = useRef(false);

  const fetchTransfers = async () => {
    if (!token) {
      setError('No se encontró token de autenticación');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await getTransfersToday(token);
      
      if (!result.success) {
        setError(result.message || 'Error al cargar las tareas');
        return;
      }

      setTransfers(result.data || []);
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current && token) {
      hasFetched.current = true;
      fetchTransfers();
    }
  }, [token]);

  const handleViewDetail = (item: any) => {
    setSelectedTransferId(item.transfer_id);
  };

  const handleMarkCompleted = async (item: any) => {
    if (!token) {
      toast.error("Token no disponible");
      return;
    }

    try {
      const result = await markTransferArrived(token, item.transfer_id);
      
      if (result.success) {
        toast.success("Traslado marcado como completado");
        fetchTransfers();
      } else {
        toast.error(result.message || "Error al completar traslado");
      }
    } catch (err: any) {
      console.error("Error al completar traslado:", err);
      toast.error("Error inesperado al completar traslado");
    }
  };

  const handleCloseDetail = () => {
    setSelectedTransferId(null);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const columns: TableColumn[] = [
    { key: "name", label: "Nombre" },
    { key: "machine_name", label: "Máquina" },
    { 
      key: "start_date", 
      label: "Fecha Inicio", 
      render: (v: string) => v ? new Date(v).toLocaleDateString("es-ES") : "-" 
    },
    { 
      key: "end_date", 
      label: "Fecha Fin", 
      render: (v: string) => v ? new Date(v).toLocaleDateString("es-ES") : "-" 
    },
  ];

  const actionButtons: ActionButton[] = [
    {
      label: "Ver\ndetalle", // ✅ CAMBIADO: En dos líneas
      className: "table-action-button",
      onClick: handleViewDetail,
    },
    {
      label: "Marcar\ncompletado", // ✅ Ya estaba en dos líneas
      className: "table-action-button table-action-button--primary",
      onClick: handleMarkCompleted,
    },
  ];

  return {
    transfers,
    loading,
    error,
    selectedTransferId,
    columns,
    actionButtons,
    handleCloseDetail,
    refreshTransfers: fetchTransfers,
    searchValue,
    onSearch: handleSearch,
  };
}
