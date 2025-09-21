// src/app/(backoffice)/dashboard/tracking/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// Importación dinámica del componente de mapa para evitar problemas de SSR.
const MapWithTracking = dynamic(
  () => import("../../../../components/organism/MapWithTracking/MapWithTracking"),
  { ssr: false }
);

/**
 * Hook para obtener la ubicación de un dispositivo desde la API.
 * @param deviceId El ID del dispositivo a rastrear.
 * @returns Los datos de ubicación y el estado de la consulta.
 */
const useLocationData = (deviceId: string | null) => {
  return useQuery({
    queryKey: ["deviceLocation", deviceId],
    queryFn: async () => {
      if (!deviceId) return null;
      const response = await fetch(`/api/location/get-location?deviceId=${deviceId}`);
      if (!response.ok) {
        throw new Error("No se pudo obtener la ubicación del dispositivo.");
      }
      return response.json();
    },
    enabled: !!deviceId,
    refetchInterval: 5000,
  });
};

/**
 * Página de seguimiento para el cliente.
 * Muestra la ubicación en tiempo real de la maquinaria rentada.
 */
export default function TrackingPage() {
  const searchParams = useSearchParams();
  // Obtener el ID del dispositivo del parámetro de la URL.
  const deviceId = searchParams.get("deviceId");

  const { data, isLoading, isError, error } = useLocationData(deviceId);

  if (!deviceId) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen">
        <p>Por favor, proporciona un ID de dispositivo para rastrear.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen">
        <p>Cargando ubicación de la maquinaria...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen text-red-500">
        <p>Error al cargar el seguimiento: {error.message}</p>
      </div>
    );
  }

  const location = data?.location;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Seguimiento de tu Renta</h1>
      <p className="text-gray-600 mb-6">Visualiza la ubicación en vivo de tu maquinaria. ID: {deviceId}</p>
      
      {location ? (
        <MapWithTracking initialPosition={[location.latitude, location.longitude]} />
      ) : (
        <div className="flex items-center justify-center h-96 bg-gray-200 rounded-lg">
          <p>Ubicación no disponible. Esperando datos del operador.</p>
        </div>
      )}
    </div>
  );
}