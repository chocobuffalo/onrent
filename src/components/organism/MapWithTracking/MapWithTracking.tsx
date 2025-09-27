// src/components/organism/MapWithTracking/MapWithTracking.tsx
"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

interface Props {
  initialPosition: [number, number];
}

const RecenterOnChange = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
};

const MapWithTracking = ({ initialPosition }: Props) => {
  const markerRef = useRef<any>(null);

  // ícono (pon tu /car-icon.png en public/)
  const vehicleIcon = L.icon({
    iconUrl: "/car-icon.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return (
    <MapContainer
      center={initialPosition}
      zoom={15}
      className="h-[500px] w-full rounded-2xl shadow-lg"
      style={{ minHeight: 400 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={initialPosition}
        icon={vehicleIcon}
        ref={markerRef}
      />
      <RecenterOnChange position={initialPosition} />
    </MapContainer>
  );
};

export default MapWithTracking;
