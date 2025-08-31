/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getMachineryList } from "@/services/getMachinery.adapter";
import { 
  MachineryResponse, 
  TableColumn, 
  StatusOption, 
  StatusColors, 
  ActionButton 
} from "@/types/machinary";

export default function useMachineryList() {
  const [machineries, setMachineries] = useState<MachineryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  // Ref para controlar si hay una petición en curso
  const isRequestInProgress = useRef(false);

  // Función para cargar las maquinarias con control de concurrencia
  const fetchMachineries = useCallback(async () => {
    // Evitar múltiples peticiones simultáneas
    if (isRequestInProgress.current) {
      return;
    }

    try {
      isRequestInProgress.current = true;
      setIsLoading(true);
      setError(null);

      const result = await getMachineryList();

      if (result.success && result.data) {
        setMachineries(result.data);
      } else {
        setError(result.message || "Error al cargar las maquinarias");
        setMachineries([]);
      }
    } catch (error: any) {
      console.error("Error inesperado en fetchMachineries:", error);
      const errorMessage = "Error de conexión. Verifica tu internet e intenta nuevamente.";
      setError(errorMessage);
      setMachineries([]);
    } finally {
      setIsLoading(false);
      isRequestInProgress.current = false;
    }
  }, []);

  // Cargar datos al montar el componente - SOLO UNA VEZ
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (mounted && !isRequestInProgress.current) {
        await fetchMachineries();
      }
    };

    loadData();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []); // Dependencias vacías para ejecutar solo al montar

  // Función para refrescar la lista manualmente
  const refreshList = useCallback(async () => {
    await fetchMachineries();
  }, [fetchMachineries]);

  // Función para manejar la búsqueda
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // Función para manejar el cambio de estado
  const handleStatusChange = useCallback((machineryId: string | number, newStatus: string) => {
    setMachineries(prevMachineries => 
      prevMachineries.map(machinery => 
        machinery.id === machineryId 
          ? { ...machinery, status: newStatus }
          : machinery
      )
    );
    
    // Aquí podrías agregar una llamada al API para persistir el cambio
    // updateMachineryStatus(machineryId, newStatus);
  }, []);

  // Función para filtrar maquinarias basado en la búsqueda
  const filteredMachineries = useCallback(() => {
    if (!searchValue.trim()) {
      return machineries;
    }

    return machineries.filter((machinery) =>
      machinery.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      machinery.brand?.toLowerCase().includes(searchValue.toLowerCase()) ||
      machinery.model?.toLowerCase().includes(searchValue.toLowerCase()) ||
      machinery.machine_category?.toLowerCase().includes(searchValue.toLowerCase()) ||
      machinery.external_id?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [machineries, searchValue]);

  // Configuración de columnas para DynamicTable
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: any, item: MachineryResponse) => (
        <div className="text-sm font-medium text-gray-900">
          {value || 'N/A'}
        </div>
      ),
    },
    {
      key: 'machine_category',
      label: 'Categoría',
    },
  ];

  // Configuración de estados para DynamicTable
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

  // Botones de acción (deshabilitados)
  const actionButtons: ActionButton[] = [
    {
      label: "Editar",
      className: "px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 transition-colors cursor-not-allowed opacity-50 bg-red-400",
      onClick: () => {
        // Sin funcionalidad por ahora
      },
    },
    {
      label: "Eliminar",
      className: "px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors cursor-not-allowed opacity-50",
      onClick: () => {
        // Sin funcionalidad por ahora
      },
    },
  ];

  return {
    // Estados para DynamicTable
    items: filteredMachineries(), // Usar datos filtrados
    isLoading,
    error,
    searchValue,
    columns,
    statusField: 'status',
    statusOptions,
    statusColors,
    actionButtons,
    
    // Funciones para DynamicTable
    onSearch: handleSearch,
    onStatusChange: handleStatusChange,
    onAction: () => {
      // Sin funcionalidad por ahora
    },
    
    // Funciones adicionales
    refreshList,
    
    // Computed values
    totalMachineries: machineries.length,
    hasData: machineries.length > 0,
    isRequestInProgress: isRequestInProgress.current,
  };
}