"use client";

import { useTrackingMap, DeviceLocation } from "../../../hooks/backend/useTrackingMap";

type Props = {
  center?: [number, number];
  zoom?: number;
  devices: DeviceLocation[];
  autoFitBounds?: boolean;
};

export default function TrackingMap({ center, zoom, devices, autoFitBounds }: Props) {
  const { mapContainer } = useTrackingMap({ center, zoom, devices, autoFitBounds });

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "500px", borderRadius: "8px" }}
    />
  );
}
