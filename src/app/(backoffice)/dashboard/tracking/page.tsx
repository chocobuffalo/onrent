"use client";

import { useState } from "react";
import TrackingMap, { DeviceLocation } from "@/components/molecule/TrackingMap/TrackingMap";

/**
 * Página que muestra el mapa de tracking para:
 * - Cliente: ver ubicación de su renta
 * - Proveedor: ver ubicación de su flota
 * - Operador: navegar hacia destino
 */
export default function TrackingPage() {
  // Posición inicial simulada del operador (centro CDMX)
  const [operatorPosition] = useState<DeviceLocation>({
    id: "operator-1",
    lat: 19.4326,
    lng: -99.1332,
  });

  // Destino fijo (obra) – se puede cambiar dinámicamente en producción
  const [destination] = useState<{ lat: number; lng: number }>({
    lat: 19.427,
    lng: -99.167,
  });

  // Flota de maquinaria ejemplo (otros operadores/vehículos)
  const [fleet] = useState<DeviceLocation[]>([
    { id: "machine-1", lat: 19.436, lng: -99.14 },
    { id: "machine-2", lat: 19.43, lng: -99.12 },
  ]);

  return (
    <div className="w-full h-[600px]">
      <TrackingMap
        operatorPosition={operatorPosition}
        initialDestination={destination}
        fleet={fleet}
      />
    </div>
  );
}
