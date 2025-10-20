"use client";

import { useEffect, useState, useCallback } from "react";
import { OperatorDetailResponse } from "@/types/operator";
import getOperatorDetail from "@/services/getOperatorDetail.adapter";
import { useSession } from "next-auth/react";

export default function useOperatorDetail(operatorId?: number) {
  const [operator, setOperator] = useState<OperatorDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const fetchOperatorDetail = useCallback(async () => {
    if (!operatorId) return;
    if (!token) {
      setError("Token no encontrado");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getOperatorDetail(token, operatorId);
      if (data) setOperator(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener detalle del operador");
    } finally {
      setLoading(false);
    }
  }, [operatorId, token]);

  useEffect(() => {
    fetchOperatorDetail();
  }, [fetchOperatorDetail]);

  return {
    operator,
    loading,
    error,
    refetch: fetchOperatorDetail,
  };
}
