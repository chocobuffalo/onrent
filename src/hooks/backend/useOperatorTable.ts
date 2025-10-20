"use client";

import { useEffect, useState, useCallback } from "react";
import { OperatorResponse } from "@/types/operator";
import getOperators from "@/services/getOperators.adapter";
import deleteOperator from "@/services/deleteOperator.adapter";
import { useSession } from "next-auth/react";

export default function useOperatorTable() {
  const [operators, setOperators] = useState<OperatorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const fetchOperators = useCallback(async () => {
    if (!token) {
      setError("Token no encontrado");
      setOperators([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getOperators(token);
      setOperators(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      setOperators([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOperators();

    // refrescar cuando se cree un operador
    const handler = () => fetchOperators();
    window.addEventListener("operatorCreated", handler);
    return () => window.removeEventListener("operatorCreated", handler);
  }, [fetchOperators]);

  const removeOperator = async (id: number) => {
    if (!token) {
      setError("Token no encontrado");
      return;
    }

    try {
      await deleteOperator(token, id);
      await fetchOperators();
    } catch (err: any) {
      setError(err.message || "Error al eliminar operador");
    }
  };

  return {
    operators,
    loading,
    error,
    refetch: fetchOperators,
    removeOperator,
  };
}
