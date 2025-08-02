"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configurar iconos para que Leaflet funcione en Next.js
const iconProto = L.Icon.Default.prototype as unknown as {
  _getIconUrl?: () => string;
};
if (iconProto._getIconUrl) {
  delete iconProto._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function SeguimientoMapa() {
  const ubicacionCliente: [number, number] = [22.1565, -100.9855];
  const proveedores: [number, number][] = [
    [22.158, -100.982],
    [22.153, -100.988],
    [22.16, -100.981],
  ];

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={ubicacionCliente}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcador cliente */}
        <Marker position={ubicacionCliente}>
          <Popup>Ubicación de la obra</Popup>
        </Marker>

        {/* Marcadores proveedores */}
        {proveedores.map((prov, index) => (
          <Marker key={index} position={prov}>
            <Popup>Proveedor {index + 1}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
