// src/app/(backoffice)/dashboard/fleet-tracking/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

// Importación dinámica del componente de mapa de flota.
const MapWithFleet = dynamic(
  () => import("@/components/organism/MapWithFleet/MapWithFleet"),
  { ssr: false }
);

/**
 * Hook para obtener la ubicación de toda la flota de un proveedor desde la API.
 * @param providerId El ID del proveedor.
 * @returns Los datos de ubicación de la flota y el estado de la consulta.
 */
const useFleetLocationData = (providerId: string | null) => {
  return useQuery({
    queryKey: ["fleetLocations", providerId],
    queryFn: async () => {
      if (!providerId) return null;
      const response = await fetch(`/api/location/get-fleet-locations?providerId=${providerId}`);
      if (!response.ok) {
        throw new Error("No se pudo obtener la ubicación de la flota.");
      }
      return response.json();
    },
    enabled: !!providerId,
    refetchInterval: 10000, // Actualizar cada 10 segundos para ver la flota en movimiento.
  });
};

/**
 * Página de seguimiento para el proveedor.
 * Muestra la ubicación en tiempo real de todas sus maquinarias activas.
 */
export default function FleetTrackingPage() {
  const { data: session } = useSession();
  // Suponemos que el ID del proveedor está en el objeto de sesión.
  const providerId = session?.user?.id || null;

  const { data, isLoading, isError, error } = useFleetLocationData(providerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando ubicación de la flota...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error al cargar la flota: {error.message}</p>
      </div>
    );
  }

  const locations = data?.locations || [];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Seguimiento de Flota</h1>
      <p className="text-gray-600 mb-6">Visualiza la ubicación en vivo de todas tus maquinarias activas.</p>

      {locations.length > 0 ? (
        <div className="relative z-0 h-[600px] w-full rounded-lg overflow-hidden shadow">
         <MapWithFleet locations={locations} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[600px] bg-gray-200 rounded-lg">
          <p>No se encontraron maquinarias en la flota del proveedor.</p>
        </div>
      )}
    </div>
  );
}