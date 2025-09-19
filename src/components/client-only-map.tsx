"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for Leaflet default icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteStep {
  lat: number;
  lng: number;
}

interface ClientOnlyMapProps {
  center: LatLng;
  zoom: number;
  currentLocation?: LatLng | null;
  destination?: LatLng | null;
  destinationAddress?: string;
  route?: RouteStep[];
  machineLocations?: { deviceId: string; position: LatLng; status?: string }[];
  mapCenterUpdaterCenter?: LatLng | null;
  children?: React.ReactNode; // For any additional children if needed
}

// Component to center map on current location or destination
const MapCenterUpdater = ({ center }: { center: LatLng | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
};

const ClientOnlyMap: React.FC<ClientOnlyMapProps> = ({
  center,
  zoom,
  currentLocation,
  destination,
  destinationAddress,
  route,
  machineLocations,
  mapCenterUpdaterCenter,
  children,
}) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
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

      {route && route.length > 0 && (
        <Polyline
          positions={route.map((step) => [step.lat, step.lng])}
          color="blue"
        />
      )}

      {machineLocations && machineLocations.map((machine) => (
        <Marker key={machine.deviceId} position={[machine.position.lat, machine.position.lng]}>
          <Popup>
            <strong>ID:</strong> {machine.deviceId}<br />
            <strong>Estado:</strong> {machine.status}<br />
            ({machine.position.lat.toFixed(4)}, {machine.position.lng.toFixed(4)})
          </Popup>
        </Marker>
      ))}

      {mapCenterUpdaterCenter && <MapCenterUpdater center={mapCenterUpdaterCenter} />}

      {children}
    </MapContainer>
  );
};

export default ClientOnlyMap;
