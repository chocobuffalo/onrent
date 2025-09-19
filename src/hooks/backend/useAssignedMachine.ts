// Hook para obtener la máquina asignada al operador
import { useEffect, useState } from "react";
import { FleetMapLocation } from "@/components/molecule/TrackingMap/TrackingMap";

export function useAssignedMachine(operatorId: string | number, token: string) {
  const [machine, setMachine] = useState<FleetMapLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!operatorId || !token) return;
    const fetchMachine = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/operator/${operatorId}/detail`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener máquina asignada");
        const data = await res.json();
        // Suponiendo que data.machine contiene la info de la máquina asignada
        if (data && data.machine) {
          setMachine({
            id: data.machine.id?.toString() || "",
            lat: data.machine.gps_lat,
            lng: data.machine.gps_lng,
            name: data.machine.name,
            machine_category: data.machine.machine_category,
            status: data.machine.status,
          });
        } else {
          setMachine(null);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchMachine();
  }, [operatorId, token]);

  return { machine, loading, error };
}
