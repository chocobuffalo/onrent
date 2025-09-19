"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => {
    // Fix for Leaflet default icon issues - only run on client
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      });
    }
    return mod.MapContainer;
  }),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface LatLng {
  lat: number;
  lng: number;
}

interface MachineLocation {
  deviceId: string;
  position: LatLng;
  status?: string; // e.g., "En ruta", "En obra", "Detenido"
}

const ProviderFleetTrackingPage = () => {
  const [machineLocations, setMachineLocations] = useState<MachineLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  // Placeholder for provider's active deviceIds
  // In a real app, this would come from a backend API call specific to the provider
  const providerDeviceIds = useRef<string[]>(["operator-machine-123", "machine-456", "operator-789"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAllMachineLocations = useCallback(async () => {
    setLoading(true);
    const fetchedLocations: MachineLocation[] = [];
    for (const deviceId of providerDeviceIds.current) {
      try {
        const response = await fetch(`/api/location?deviceId=${deviceId}`);
        const data = await response.json();
        if (response.ok && data.latitude !== undefined && data.longitude !== undefined) {
          fetchedLocations.push({
            deviceId: data.deviceId,
            position: { lat: data.latitude, lng: data.longitude },
            status: "Activo", // Placeholder status
          });
        } else {
          console.warn(`Could not get location for device ${deviceId}:`, data.error || "Unknown error");
        }
      } catch (error) {
        console.error(`Error fetching location for device ${deviceId}:`, error);
      }
    }
    setMachineLocations(fetchedLocations);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllMachineLocations(); // Initial fetch
    trackingIntervalRef.current = setInterval(fetchAllMachineLocations, 20000); // Fetch every 20 seconds

    return () => {
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
    };
  }, [fetchAllMachineLocations]);

  const mapCenter = machineLocations.length > 0 
    ? machineLocations[0].position 
    : { lat: 22.1565, lng: -100.9855 }; // Default center if no machines

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seguimiento de Flota (Proveedor)</h1>

      {loading && <p>Cargando ubicaciones de la flota...</p>}

      <div style={{ height: "600px", width: "100%", borderRadius: "0.5rem" }}>
        {mounted && mapCenter ? (
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={10}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            />
            {machineLocations.map((machine) => (
              <Marker key={machine.deviceId} position={[machine.position.lat, machine.position.lng]}>
                <Popup>
                  <strong>ID:</strong> {machine.deviceId}<br />
                  <strong>Estado:</strong> {machine.status}<br />
                  ({machine.position.lat.toFixed(4)}, {machine.position.lng.toFixed(4)})
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 rounded">
            No hay máquinas activas para mostrar o cargando mapa...
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderFleetTrackingPage;