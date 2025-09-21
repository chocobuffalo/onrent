// src/components/organism/MapWithTracking/MapWithTracking.tsx

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Se asume que LatLng es una interfaz global o está definida aquí.
interface LatLng {
  lat: number;
  lng: number;
}

interface MapWithTrackingProps {
  initialPosition?: [number, number];
  zoom?: number;
  // La propiedad 'location' es una nueva adición para mostrar un marcador único.
  location?: LatLng | null;
}

export default function MapWithTracking({
  initialPosition = [22.1565, -100.9855],
  zoom = 6,
  location,
}: MapWithTrackingProps) {
  // Ahora el componente solo se encarga de mostrar el mapa.
  // La lógica de obtención de datos se maneja en la página que lo utiliza.

  return (
    <div style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}>
      <MapContainer
        center={initialPosition}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />

        {/* Si la ubicación es proporcionada, muestra un marcador en el mapa. */}
        {location && (
          <Marker position={[location.lat, location.lng]}>
            <Popup>Ubicación de la maquinaria</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}