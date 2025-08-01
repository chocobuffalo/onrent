"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🛠️ Corrige íconos de Leaflet que no se cargan bien en Vite/Next
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapaCliente({
  ubicacion,
  setUbicacion,
}: {
  ubicacion: [number, number] | null;
  setUbicacion: (coords: [number, number]) => void;
}) {
  const [position, setPosition] = useState<[number, number]>(
    ubicacion || [22.1565, -100.9855]
  );

  useEffect(() => {
    if (ubicacion) setPosition(ubicacion);
  }, [ubicacion]);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
        setUbicacion(coords);
      },
    });
    return null;
  }

  return (
    <div style={{ height: "300px", width: "100%", borderRadius: "0.5rem" }}>
      <MapContainer
        key={position.toString()}
        center={position}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        {ubicacion && <Marker position={ubicacion} />}
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}
