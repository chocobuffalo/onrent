import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

export interface MachineMarkerProps {
  id: string;
  lat: number;
  lng: number;
  name?: string;
  status?: string;
  [key: string]: any;
}

const machineIcon = new L.Icon({
  iconUrl: "/images/catalogue/machine5.jpg", // Puedes cambiar por un ícono personalizado
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export function MachineMarker({ id, lat, lng, name, status, ...rest }: MachineMarkerProps) {
  return (
    <Marker position={[lat, lng]} icon={machineIcon} {...rest}>
      <Popup>
        <div>
          <strong>{name || `Máquina ${id}`}</strong>
          {status && <div>Estado: {status}</div>}
        </div>
      </Popup>
    </Marker>
  );
}
