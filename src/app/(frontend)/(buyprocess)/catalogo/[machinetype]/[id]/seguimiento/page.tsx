"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configurar iconos personalizados (verde y rojo)
const iconProveedor = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/1483/1483336.png", // Ícono verde
  iconSize: [30, 30],
});

const iconCliente = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/1483/1483397.png", // Ícono rojo
  iconSize: [30, 30],
});

export default function SeguimientoMapa() {
  const ubicacionCliente: [number, number] = [22.1523, -100.985]; // Rojo
  const proveedores: [number, number][] = [
    [22.158, -100.982],
    [22.153, -100.988],
    [22.160, -100.990],
  ]; // Verdes

  return (
    <MapContainer
      center={ubicacionCliente}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Mapa estilo gris */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marcador cliente (rojo) */}
      <Marker position={ubicacionCliente} icon={iconCliente}>
        <Popup>Ubicación de la obra</Popup>
      </Marker>

      {/* Marcadores proveedores (verde) */}
      {proveedores.map((pos, index) => (
        <Marker key={index} position={pos} icon={iconProveedor}>
          <Popup>Proveedor cercano</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
