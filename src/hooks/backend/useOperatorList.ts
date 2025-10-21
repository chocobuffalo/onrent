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
      
      // ✅ CONSOLE LOG PARA VER TODOS LOS OPERADORES Y SUS PROPIEDADES
      console.log("📋 Lista completa de operadores:", data);
      console.log("📊 Total de operadores:", data.length);
      
      // ✅ CONSOLE LOG DE CADA OPERADOR CON SU ID
      data.forEach((operator, index) => {
        console.log(`👤 Operador ${index + 1}:`, {
          operator_id: operator.operator_id,
          name: operator.name,
          email: operator.email,
          phone: operator.phone,
          availability: operator.availability,
          active: operator.active,
          "Todas las propiedades": operator
        });
      });
      
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

  const filteredOperators = useMemo(() => {
    if (!searchValue.trim()) return operators;
    
    const search = searchValue.toLowerCase();
    return operators.filter(operator =>
      operator.name?.toLowerCase().includes(search) ||
      operator.email?.toLowerCase().includes(search) ||
      operator.phone?.toLowerCase().includes(search)
    );
  }, [operators, searchValue]);

  const getAvailabilityLabel = (availability: string) => {
    const labels: { [key: string]: string } = {
      'available': 'Disponible',
      'unavailable': 'No disponible',
      'busy': 'Ocupado'
    };
    return labels[availability] || availability;
  };

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value: any) => value || 'N/A',
    },
    {
      key: 'email',
      label: 'Correo',
      render: (value: any) => value || 'N/A',
    },
    {
      key: 'phone',
      label: 'Teléfono',
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
        // ✅ CONSOLE LOG CUANDO HACES CLIC EN DETALLE
        console.log("👁️ Ver detalle del operador:", item);
        if (props?.onDetail && item) props.onDetail(item);
      },
    },
    {
      label: "Editar",
      className: "table-action-button futura-font",
      onClick: (item?: OperatorResponse) => {
        // ✅ CONSOLE LOG CUANDO HACES CLIC EN EDITAR
        console.log("✏️ Editar operador:", item);
        if (props?.onEdit && item) props.onEdit(item);
      },
    },
    {
      label: "Desactivar",
      className: "table-action-button futura-font",
      onClick: (item?: OperatorResponse) => {
        // ✅ CONSOLE LOG CUANDO HACES CLIC EN DESACTIVAR
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
