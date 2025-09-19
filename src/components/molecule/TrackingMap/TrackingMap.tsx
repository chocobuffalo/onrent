"use client";


import { useTrackingMap } from "@/hooks/backend/useTrackingMap";

// Tipado extendido para la flota
export interface DeviceLocation {
  id: string;
  lat: number;
  lng: number;
}

export interface FleetMapLocation extends DeviceLocation {
  name?: string;
  machine_category?: string;
  status?: string;
}

interface TrackingMapProps {
  operatorPosition?: DeviceLocation | null;
  initialDestination?: { lat: number; lng: number } | null;
  fleet?: FleetMapLocation[];
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
