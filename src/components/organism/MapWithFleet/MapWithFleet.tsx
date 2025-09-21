// src/components/organism/MapWithFleet/MapWithFleet.tsx

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface LatLng {
  lat: number;
  lng: number;
}

interface MachineLocation {
  deviceId: string;
  location: LatLng;
}

interface MapWithFleetProps {
  locations: MachineLocation[];
  zoom?: number;
}

export default function MapWithFleet({ locations, zoom = 6 }: MapWithFleetProps) {
  // La posición inicial se declara como una tupla de dos números para el tipado correcto.
  const initialPosition: [number, number] = [22.1565, -100.9855];

  // El centro del mapa se calcula de forma segura y se asegura el tipado correcto.
  const center: [number, number] =
    locations.length > 0
      ? [locations[0].location.lat, locations[0].location.lng]
      : initialPosition;

  return (
    <div style={{ height: "600px", width: "100%", borderRadius: "0.5rem" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />

        {locations.map((machine) => (
          <Marker
            key={machine.deviceId}
            position={[machine.location.lat, machine.location.lng]}
          >
            <Popup>
              <span>Máquina: {machine.deviceId}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}