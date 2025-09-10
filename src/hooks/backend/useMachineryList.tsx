"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getMachineryList } from "@/services/getMachinery.adapter";
import { 
  MachineryResponse, 
  TableColumn, 
  StatusOption, 
  StatusColors, 
  ActionButton 
} from "@/types/machinary";
import { useSession } from "next-auth/react";

interface UseMachineryListProps {
  onEdit?: (item: MachineryResponse) => void;
  onDelete?: (item: MachineryResponse) => void;
  onCreate?: (item: MachineryResponse) => void;
}

export default function useMachineryList(props?: UseMachineryListProps) {
  const [machineries, setMachineries] = useState<MachineryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const { data: session } = useSession();

  const isRequestInProgress = useRef(false);
  const token = (session as any)?.accessToken || "";

  const fetchMachineries = useCallback(async () => {
    if (isRequestInProgress.current || !token) return;

    try {
      isRequestInProgress.current = true;
      setIsLoading(true);
      setError(null);
      
      const result = await getMachineryList(token);

      if (result.success && result.data) {
        setMachineries(result.data);
      } else {
        setError(result.message || "Error al cargar las maquinarias");
        setMachineries([]);
      }
    } catch (error: any) {
      setError("Error de conexión. Verifica tu internet e intenta nuevamente.");
      setMachineries([]);
    } finally {
      setIsLoading(false);
      isRequestInProgress.current = false;
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchMachineries();
    }
  }, [token, fetchMachineries]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleStatusChange = useCallback((machineryId: string | number, newStatus: string) => {
    setMachineries(prev => 
      prev.map(machinery => 
        machinery.id === machineryId ? { ...machinery, status: newStatus } : machinery
      )
    );
  }, []);

  const handleCreate = useCallback((newItem: MachineryResponse) => {
    setMachineries(prev => [newItem, ...prev]);
    props?.onCreate?.(newItem);
  }, [props?.onCreate]);

  const removeFromLocalState = useCallback((item: MachineryResponse) => {
    setMachineries(prev => prev.filter(machinery => machinery.id !== item.id));
  }, []);

  const refreshList = useCallback(() => fetchMachineries(), [fetchMachineries]);

  // Filtrado simple
  const filteredMachineries = useMemo(() => {
    if (!searchValue.trim()) return machineries;
    
    const search = searchValue.toLowerCase();
    return machineries.filter(machinery =>
      machinery.name?.toLowerCase().includes(search) ||
      machinery.machine_category?.toLowerCase().includes(search)
    );
  }, [machineries, searchValue]);

  // Configuraciones estáticas (sin useMemo innecesario)
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: any) => (
        <div className="text-sm font-medium text-gray-700">
          {value || 'N/A'}
        </div>
      ),
    },
    {
      key: 'machine_category',
      label: 'Categoría',
      render: (value: any) => (
        <div className="text-sm font-medium capitalize text-gray-700">
          {value || 'N/A'}
        </div>
      ),
    },
  ];

  const statusOptions: StatusOption[] = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'ha_llegado', label: 'Ha llegado' },
    { value: 'llegando_a_tu_obra', label: 'Llegando a tu obra' },
    { value: 'en_camino', label: 'En camino' },
    { value: 'preparando_maquina', label: 'Preparando maquina' },
    { value: 'completado', label: 'Completado' },
  ];

  const statusColors: StatusColors = {
    'disponible': 'bg-white text-black border-orange-500',
    'ha_llegado': 'bg-[#009145] text-white border-[#009145]',
    'llegando_a_tu_obra': 'bg-[#8BC53F] text-white border-[#8BC53F]',
    'en_camino': 'bg-[#FBED21] text-black border-[#FBED21]',
    'preparando_maquina': 'bg-[#F05A24] text-white border-[#F05A24]',
    'completado': 'bg-[#13123D] text-white border-[#13123D]',
  };

  const actionButtons: ActionButton[] = [
    {
      label: "Editar",
      className: "px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 transition-colors",
      onClick: (item?: MachineryResponse) => {
        if (props?.onEdit && item) props.onEdit(item);
      },
    },
    {
      label: "Eliminar",
      className: "px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors",
      onClick: (item?: MachineryResponse) => {
        if (item && props?.onDelete) props.onDelete(item);
      },
    },
  ];

  return {
    items: filteredMachineries,
    isLoading,
    error,
    searchValue,
    columns,
    statusField: 'status',
    statusOptions,
    statusColors,
    actionButtons,
    onSearch: handleSearch,
    onStatusChange: handleStatusChange,
    onAction: () => {},
    refreshList,
    removeFromLocalState,
    handleCreate,
    totalMachineries: machineries.length,
    hasData: machineries.length > 0,
    isRequestInProgress: isRequestInProgress.current,
  };
}