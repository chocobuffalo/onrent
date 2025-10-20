"use client";

import { useState } from "react";
import { UpdateOperatorRequest, UpdateOperatorResponse } from "@/types/operator";
import updateOperator from "@/services/updateOperator.adapter";
import { toast } from "react-toastify";

export default function useOperatorUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitUpdate = async (
    id: number,
    payload: UpdateOperatorRequest
  ): Promise<UpdateOperatorResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const result = await updateOperator(token, id, payload);

      if (result.success) {
        toast.success(result.message || "Operador actualizado correctamente");
        // refrescar tabla
        window.dispatchEvent(new CustomEvent("operatorUpdated"));
      } else {
        toast.error(result.message || "Error al actualizar operador");
      }

      return result;
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      toast.error("Error al actualizar operador");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitUpdate,
    loading,
    error,
  };
}
