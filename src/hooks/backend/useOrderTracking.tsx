"use client";

import { useEffect, useState } from "react";

export type LatLng = { lat: number; lng: number };

export function useOrderTracking() {
  const [operatorPosition, setOperatorPosition] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);

  // Ejemplo: si todavía no hay backend, puedes simular movimiento del operador.
  // Borra esta simulación cuando uses datos reales.
  useEffect(() => {
    let timer: any;
    if (!operatorPosition && destination) {
      // inicia operador cerca del destino, solo para demo
      setOperatorPosition({
        lat: destination.lat + 0.01,
        lng: destination.lng + 0.01,
      });
    }
    // Simulación de “avance” hacia el destino
    if (operatorPosition && destination) {
      timer = setInterval(() => {
        const factor = 0.02; // paso
        const next = {
          lat: operatorPosition.lat + (destination.lat - operatorPosition.lat) * factor,
          lng: operatorPosition.lng + (destination.lng - operatorPosition.lng) * factor,
        };
        setOperatorPosition(next);
      }, 1500);
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  return {
    operatorPosition,
    destination,
    setDestination,
    setOperatorPosition, // por si quieres inyectar data real desde fuera
  };
}
