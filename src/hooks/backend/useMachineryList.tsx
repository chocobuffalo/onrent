"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getMachineryList } from "@/services/getMachinery.adapter";
import { 
  MachineryResponse, 
  TableColumn, 
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

  const handleCreate = useCallback((newItem: MachineryResponse) => {
    setMachineries(prev => [newItem, ...prev]);
    props?.onCreate?.(newItem);
  }, [props?.onCreate]);

  const removeFromLocalState = useCallback((item: MachineryResponse) => {
    setMachineries(prev => prev.filter(machinery => machinery.id !== item.id));
  }, []);

  const refreshList = useCallback(() => fetchMachineries(), [fetchMachineries]);

  const filteredMachineries = useMemo(() => {
    if (!searchValue.trim()) return machineries;
    
    const search = searchValue.toLowerCase();
    return machineries.filter(machinery =>
      machinery.name?.toLowerCase().includes(search) ||
      machinery.machine_category?.toLowerCase().includes(search)
    );
  }, [machineries, searchValue]);

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
    {
      key: 'status',
      label: 'Estado',
      render: (value: any) => (
        <div className="text-sm font-medium capitalize text-gray-700">
          {value || 'N/A'}
        </div>
      ),
    },
  ];

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
    actionButtons,
    onSearch: handleSearch,
    onAction: () => {},
    refreshList,
    removeFromLocalState,
    handleCreate,
    totalMachineries: machineries.length,
    hasData: machineries.length > 0,
    isRequestInProgress: isRequestInProgress.current,
  };
}