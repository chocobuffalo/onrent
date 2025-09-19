"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => {
    // Fix for Leaflet default icon issues - only run on client
    if (typeof window !== 'undefined' && mod.Marker) {
      const L = require('leaflet');
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteStep {
  lat: number;
  lng: number;
}

const ClientTrackingPage = () => {
  const { id } = useParams(); // Get deviceId from URL
  const deviceId = id as string; // Cast to string

  const [machinePosition, setMachinePosition] = useState<LatLng | null>(null);
  const [destinationPosition, setDestinationPosition] = useState<LatLng | null>({
    lat: 22.1565, // Placeholder for destination (obra)
    lng: -100.9855,
  });
  const [route, setRoute] = useState<RouteStep[]>([]);
  const [status, setStatus] = useState<string>("Cargando...");
  const [eta, setEta] = useState<string>("Calculando...");
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchMachineLocation = useCallback(async () => {
    if (!deviceId) return;
    try {
      const response = await fetch(`/api/location?deviceId=${deviceId}`);
      const data = await response.json();
      if (response.ok && data.latitude !== undefined && data.longitude !== undefined) {
        setMachinePosition({ lat: data.latitude, lng: data.longitude });
        setStatus("En tránsito"); // Update status based on successful fetch
        // In a real scenario, ETA would come from the backend route calculation
        setEta("2 horas"); 
      } else {
        toast.error(data.error || "Error al obtener la ubicación de la máquina.");
        setStatus("Ubicación no disponible");
      }
    } catch (error) {
      console.error("Error fetching machine location:", error);
      toast.error("Error de conexión al obtener la ubicación.");
      setStatus("Error de conexión");
    }
  }, [deviceId]);

  const calculateRoute = useCallback(async () => {
    if (!machinePosition || !destinationPosition) return;
    try {
      const response = await fetch("/api/get-map/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: { lat: machinePosition.lat, lng: machinePosition.lng },
          destination: { lat: destinationPosition.lat, lng: destinationPosition.lng },
        }),
      });
      const data = await response.json();
      if (response.ok && data.Legs && data.Legs.length > 0) {
        const newRoute: RouteStep[] = data.Legs[0].Geometry.LineString.map((point: [number, number]) => ({
          lng: point[0],
          lat: point[1],
        }));
        setRoute(newRoute);
      } else {
        setRoute([]);
        console.error(data.error || "Error al calcular la ruta.");
      }
    } catch (error) {
      console.error("Route API error:", error);
    }
  }, [machinePosition, destinationPosition]);

  useEffect(() => {
    fetchMachineLocation(); // Initial fetch
    trackingIntervalRef.current = setInterval(fetchMachineLocation, 15000); // Fetch every 15 seconds

    return () => {
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
    };
  }, [fetchMachineLocation]);

  useEffect(() => {
    if (machinePosition && destinationPosition) {
      calculateRoute();
    }
  }, [machinePosition, destinationPosition, calculateRoute]);

  const mapCenter = machinePosition || destinationPosition || { lat: 22.1565, lng: -100.9855 };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seguimiento de Renta (ID: {deviceId})</h1>

      <div className="mb-4">
        <p><strong>Estado:</strong> {status}</p>
        <p><strong>Tiempo estimado de llegada:</strong> {eta}</p>
      </div>

      <div style={{ height: "600px", width: "100%", borderRadius: "0.5rem" }}>
        {mounted && mapCenter ? (
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={13}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            />
            {machinePosition && (
              <Marker position={[machinePosition.lat, machinePosition.lng]}>
                <Popup>Ubicación Actual de la Máquina</Popup>
              </Marker>
            )}
            {destinationPosition && (
              <Marker position={[destinationPosition.lat, destinationPosition.lng]}>
                <Popup>Destino de la Obra</Popup>
              </Marker>
            )}
            {route.length > 0 && (
              <Polyline
                positions={route.map((step) => [step.lat, step.lng])}
                color="red"
              />
            )}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 rounded">
            Cargando mapa de seguimiento...
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientTrackingPage;