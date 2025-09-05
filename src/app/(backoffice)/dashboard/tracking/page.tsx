"use client";

import { useEffect, useState } from "react";
import TrackingMap from "@/components/molecule/TrackingMap/TrackingMap";
import { DeviceLocation } from "@/hooks/backend/useTrackingMap";

export default function TrackingPage() {
  const [devices, setDevices] = useState<DeviceLocation[]>([]);

  // fetch inicial (polling REST)
  useEffect(() => {
    async function fetchInitial() {
      try {
        const res = await fetch("/api/devices/active");
        if (!res.ok) return;
        const data = await res.json();
        setDevices(data);
      } catch (err) {
        console.error("Error cargando devices:", err);
      }
    }
    fetchInitial();
  }, []);

  // conectar WebSocket (simulación)
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/tracking");

    ws.onmessage = (event) => {
      const update: DeviceLocation = JSON.parse(event.data);

      setDevices((prev) => {
        const exists = prev.find((d) => d.id === update.id);
        if (exists) {
          return prev.map((d) => (d.id === update.id ? update : d));
        }
        return [...prev, update];
      });
    };

    ws.onclose = () => {
      console.warn("WebSocket cerrado. Podrías reintentar aquí.");
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Mapa de Maquinarias Activas</h1>
      <TrackingMap devices={devices} autoFitBounds />
    </div>
  );
}
