"use client";

import { useEffect, useRef } from "react";

export type DeviceLocation = {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  status?: "en_ruta" | "disponible" | "apagado";
};

type UseTrackingMapProps = {
  center?: [number, number];
  zoom?: number;
  devices: DeviceLocation[];
  autoFitBounds?: boolean; // opcional para proveedor
};

export function useTrackingMap({
  center = [-99.1332, 19.4326],
  zoom = 12,
  devices,
  autoFitBounds = false,
}: UseTrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const markers = useRef<{ [id: string]: any }>({});

  // cargar MapLibre dinámicamente
  async function loadMapLibre() {
    if (typeof window === "undefined") return;
    if ((window as any).maplibregl) return (window as any).maplibregl;

    return new Promise<void>((resolve, reject) => {
      const cssId = "maplibre-gl-css";
      if (!document.getElementById(cssId)) {
        const link = document.createElement("link");
        link.id = cssId;
        link.rel = "stylesheet";
        link.href =
          "https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css";
        document.head.appendChild(link);
      }

      const script = document.createElement("script");
      script.src = "https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // inicializar mapa
  useEffect(() => {
    const initMap = async () => {
      if (!mapContainer.current || map.current) return;
      await loadMapLibre();

      const res = await fetch("/api/get-map/config/route");
      const config = await res.json();

      const maplibregl = (window as any).maplibregl;
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: config.style,
        center,
        zoom,
      });

      map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    };

    initMap();
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markers.current = {};
    };
  }, [center, zoom]);

  // actualizar markers
  useEffect(() => {
    if (!map.current) return;

    const maplibregl = (window as any).maplibregl;

    devices.forEach((device) => {
      const { id, lat, lng, label, status } = device;

      // color dinámico según status
      let bg = "orange";
      if (status === "disponible") bg = "green";
      if (status === "apagado") bg = "gray";

      if (markers.current[id]) {
        markers.current[id].setLngLat([lng, lat]);
        // actualizar popup dinámicamente
        if (label) {
          markers.current[id]
            .setPopup(new maplibregl.Popup().setText(label));
        }
        // actualizar color dinámico
        markers.current[id].getElement().style.backgroundColor = bg;
      } else {
        const el = document.createElement("div");
        el.style.width = "14px";
        el.style.height = "14px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = bg;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat]);

        if (label) {
          marker.setPopup(new maplibregl.Popup().setText(label));
        }

        marker.addTo(map.current);
        markers.current[id] = marker;
      }
    });

    // limpiar markers que ya no existen
    Object.keys(markers.current).forEach((id) => {
      if (!devices.find((d) => d.id === id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });

    // auto-ajustar bounds
    if (autoFitBounds && devices.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      devices.forEach((d) => bounds.extend([d.lng, d.lat]));
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }, [devices, autoFitBounds]);

  return { mapContainer, map };
}
