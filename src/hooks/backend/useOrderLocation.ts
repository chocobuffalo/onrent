// Hook para obtener la ubicación en tiempo real de una orden (cliente)
import { useEffect, useState } from "react";

export const useOrderLocation = (orderId: string | number, pollingInterval = 10000) => {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/order/${orderId}/location`);
        if (!res.ok) throw new Error("Error al obtener ubicación");
        const data = await res.json();
        setLocation(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
    const intervalId = setInterval(fetchLocation, pollingInterval);
    
    return () => clearInterval(intervalId);
  }, [orderId, pollingInterval]);

  return { location, loading, error };
};