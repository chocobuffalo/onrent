import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMachineTracking } from "@/hooks/component/useMachineTracking";
import { MachineMarker } from "@/components/atoms/MachineMarker/MachineMarker";

interface MapWithTrackingProps {
  serverUrl: string;
  initialPosition?: [number, number];
  zoom?: number;
}

export function MapWithTracking({ serverUrl, initialPosition = [22.1565, -100.9855], zoom = 6 }: MapWithTrackingProps) {
  const machines = useMachineTracking(serverUrl);

  return (
    <div style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}>
      <MapContainer center={initialPosition} zoom={zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        {machines.map((machine) => (
          <MachineMarker key={machine.id} {...machine} />
        ))}
      </MapContainer>
    </div>
  );
}
