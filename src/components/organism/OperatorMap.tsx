// src/components/organism/OperatorMap/OperatorMap.tsx
"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

interface LatLng {
  lat: number;
  lng: number;
}

interface OperatorMapProps {
  currentLocation: LatLng | null;
  destination: LatLng | null;
  destinationAddress: string;
  route: LatLng[];
  isNavigating: boolean;
}

// Componente interno para centrar el mapa
const MapCenterUpdater = ({ center }: { center: LatLng | null }) => {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.whenReady(() => {
        map.setView([center.lat, center.lng], map.getZoom());
      });
    }
  }, [center, map]);
  return null;
};

const OperatorMap = ({
  currentLocation,
  destination,
  destinationAddress,
  route,
  isNavigating,
}: OperatorMapProps) => {
  // Fix para los íconos de Leaflet en producción
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((LModule) => {
        const L = LModule.default || LModule;
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      });
    }
  }, []); // El hook se ejecuta una vez al montar el componente.

  const initialPosition: LatLng = { lat: 22.1565, lng: -100.9855 };

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-200 rounded">
        Cargando mapa... Asegúrate de permitir la geolocalización.
      </div>
    );
  }

  const routePositions: [number, number][] = route.map((step) => [
    step.lat,
    step.lng,
  ]);

  return (
    <div style={{ height: "600px", width: "100%", borderRadius: "0.5rem" }}>
      <MapContainer
        center={[currentLocation.lat, currentLocation.lng]}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>Ubicación Actual del Operador</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>Destino: {destinationAddress}</Popup>
          </Marker>
        )}
        {routePositions.length > 0 && (
          <Polyline positions={routePositions} color="blue" />
        )}
        <MapCenterUpdater
          center={
            isNavigating ? currentLocation : destination || currentLocation
          }
        />
      </MapContainer>
    </div>
  );
};

export default OperatorMap;