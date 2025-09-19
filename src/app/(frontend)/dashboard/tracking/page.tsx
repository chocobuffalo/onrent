import dynamic from "next/dynamic";

// Importa el organismo de forma dinámica para evitar problemas de SSR con Leaflet
const MapWithTracking = dynamic(
  () => import("@/components/organism/MapWithTracking/MapWithTracking").then(mod => mod.MapWithTracking),
  { ssr: false }
);

export default function DashboardTrackingPage() {
  // Cambia la URL por la de tu backend de Socket.IO
  const SOCKET_SERVER_URL = "http://localhost:3001";

  return (
    <div style={{ padding: 24 }}>
      <h2>Tracking en tiempo real de máquinas</h2>
      <MapWithTracking serverUrl={SOCKET_SERVER_URL} />
    </div>
  );
}
