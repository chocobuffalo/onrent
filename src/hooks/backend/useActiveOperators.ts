// Hook para obtener operadores activos (proveedor)
import { useEffect, useState } from "react";

export interface OperatorLocation {
  id: string;
  lat: number;
  lng: number;
  name?: string;
  status?: string;
}

export function useActiveOperators(token: string, pollingInterval = 10000) {
  const [operators, setOperators] = useState<OperatorLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let intervalId: NodeJS.Timeout;
    const fetchOperators = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/location/sync/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener operadores activos");
        const data = await res.json();
        // Suponiendo que data es un array de ubicaciones de operadores
        setOperators(
          Array.isArray(data)
            ? data.map((op) => ({
                id: op.id?.toString() || op.operator_id?.toString() || "",
                lat: op.lat,
                lng: op.lng,
                name: op.name,
                status: op.status,
              }))
            : []
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchOperators();
    intervalId = setInterval(fetchOperators, pollingInterval);
    return () => clearInterval(intervalId);
  }, [token, pollingInterval]);

  return { operators, loading, error };
}
