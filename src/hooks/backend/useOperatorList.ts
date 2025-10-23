"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import getOperators from "@/services/getOperators.adapter";
import { 
  OperatorResponse, 
  TableColumn, 
  ActionButton 
} from "@/types/operator";
import { useSession } from "next-auth/react";

interface UseOperatorListProps {
  onEdit?: (item: OperatorResponse) => void;
  onDetail?: (item: OperatorResponse) => void;
  onDeactivate?: (item: OperatorResponse) => void;
}

export default function useOperatorList(props?: UseOperatorListProps) {
  const [operators, setOperators] = useState<OperatorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const { data: session } = useSession();

  const token = (session as any)?.accessToken || "";

  const fetchOperators = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getOperators(token);
      console.log("📋 Lista completa de operadores:", data);
      console.log("📊 Total de operadores:", data.length);
      
      setOperators(data);
    } catch (error: any) {
      setError(error.message || "Error al cargar los operadores");
      setOperators([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchOperators();
    }
  }, [token, fetchOperators]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const refreshList = useCallback(() => fetchOperators(), [fetchOperators]);

  // ✅ CORREGIDO: Manejo seguro de valores null/undefined
  const filteredOperators = useMemo(() => {
    if (!searchValue.trim()) return operators;
    
    const search = searchValue.toLowerCase();
    return operators.filter(operator => {
      // Convertir a string vacío si es null/undefined, luego aplicar toLowerCase
      const name = (operator.name || '').toLowerCase();
      const email = (operator.email || '').toLowerCase();
      const phone = (operator.phone || '').toLowerCase();
      
      return (
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search)
      );
    });
  }, [operators, searchValue]);

  const getAvailabilityLabel = (availability: string) => {
    const labels: { [key: string]: string } = {
      'available': 'Disponible',
      'unavailable': 'No disponible',
      'busy': 'Ocupado'
    };
    return labels[availability] || availability;
  };

  // ✅ SOLO 4 COLUMNAS: Nombre, Disponibilidad, Estado y Acciones
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: any) => value || 'N/A',
    },
    {
      key: 'availability',
      label: 'Disponibilidad',
      render: (value: any) => getAvailabilityLabel(value),
    },
    {
      key: 'active',
      label: 'Estado',
      render: (value: boolean) => value ? 'Activo' : 'Inactivo',
    },
  ];

  const actionButtons: ActionButton[] = [
    {
      label: "Detalle",
      className: "table-action-button futura-font",
      onClick: (item?: OperatorResponse) => {
        console.log("👁️ Ver detalle del operador:", item);
        if (props?.onDetail && item) props.onDetail(item);
      },
    },
    {
      label: "Editar",
      className: "table-action-button futura-font",
      onClick: (item?: OperatorResponse) => {
        console.log("✏️ Editar operador:", item);
        if (props?.onEdit && item) props.onEdit(item);
      },
    },
    {
      label: "Desactivar",
      className: "table-action-button futura-font",
      onClick: (item?: OperatorResponse) => {
        console.log("🚫 Desactivar operador:", item);
        if (props?.onDeactivate && item) props.onDeactivate(item);
      },
    },
  ];

  return {
    items: filteredOperators,
    isLoading,
    error,
    searchValue,
    columns,
    actionButtons,
    onSearch: handleSearch,
    refreshList,
    totalOperators: operators.length,
    hasData: operators.length > 0,
  };
}
