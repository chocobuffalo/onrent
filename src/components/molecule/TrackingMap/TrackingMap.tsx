"use client";

import { useTrackingMap } from "@/hooks/backend/useTrackingMap";

// Tipado de la posición de un dispositivo / maquinaria
export interface DeviceLocation {
  id: string;       // Identificador único del dispositivo/operador
  lat: number;      // Latitud
  lng: number;      // Longitud
}

// Props del componente
interface TrackingMapProps {
  operatorPosition?: DeviceLocation | null;      // Posición inicial del operador (azul)
  initialDestination?: { lat: number; lng: number } | null; // Destino de la ruta (rojo)
  fleet?: DeviceLocation[];                     // Otros vehículos / maquinaria (verde)
}

/**
 * Componente principal que renderiza un mapa con:
 * - Operador
 * - Destino
 * - Flota de maquinaria
 * - Ruta simulada del operador
 */
export default function TrackingMap({ operatorPosition, initialDestination, fleet }: TrackingMapProps) {
  // Lógica del mapa, marcadores y simulación
  const mapContainerRef = useTrackingMap({
    operatorPosition,
    initialDestination,
    fleet,
  });

  // Retorna el contenedor donde MapLibre renderiza el mapa
  return <div ref={mapContainerRef} className="w-full h-full rounded-lg shadow-md" />;
}
