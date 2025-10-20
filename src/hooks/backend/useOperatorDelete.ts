"use client";

import { useState } from "react";
import deleteOperator from "@/services/deleteOperator.adapter";
import { DeleteOperatorResponse } from "@/types/operator";
import { toast } from "react-toastify";

export default function useOperatorDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: number): Promise<DeleteOperatorResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const result = await deleteOperator(token, id);

      if (result.success) {
        toast.success(result.message || "Operador eliminado correctamente");
        // refrescar tabla
        window.dispatchEvent(new CustomEvent("operatorDeleted"));
      } else {
        toast.error(result.message || "Error al eliminar operador");
      }

      return result;
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      toast.error("Error al eliminar operador");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    remove,
    loading,
    error,
  };
}
