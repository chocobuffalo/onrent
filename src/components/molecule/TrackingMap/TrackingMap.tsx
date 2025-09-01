"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type LatLng = { lat: number; lng: number };

type TrackingMapProps = {
  operatorPosition?: LatLng | null;
  initialDestination?: LatLng | null;
  onDestinationChange?: (dest: LatLng | null) => void;
  avgSpeedKmh?: number;
  disablePickDestination?: boolean;
  autoFitBounds?: boolean;
};

type MapConfig = {
  style: string;
  region: string;
  mapName: string;
};

const ROUTE_LAYER_ID = "temp-route-line";
const ROUTE_SOURCE_ID = "temp-route-source";

// Loader dinámico de MapLibre (igual que en useAmazonLocationMap)
const loadMapLibre = () => {
  return new Promise<void>((resolve, reject) => {
    if ((window as any).maplibregl) {
      resolve();
      return;
    }

    const cssLink = document.createElement("link");
    cssLink.href = "https://unpkg.com/maplibre-gl@3.x/dist/maplibre-gl.css";
    cssLink.rel = "stylesheet";
    document.head.appendChild(cssLink);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/maplibre-gl@3.x/dist/maplibre-gl.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load MapLibre GL JS from CDN"));
    document.head.appendChild(script);
  });
};

function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const x =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

export default function TrackingMap({
  operatorPosition: operatorPositionProp = null,
  initialDestination = null,
  onDestinationChange,
  avgSpeedKmh = 35,
  disablePickDestination = false,
  autoFitBounds = true,
}: TrackingMapProps) {
  const mapRef = useRef<any | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const operatorMarkerRef = useRef<any | null>(null);
  const destinationMarkerRef = useRef<any | null>(null);

  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selfPosition, setSelfPosition] = useState<LatLng | null>(null);
  const operatorPosition = operatorPositionProp ?? selfPosition;

  const [destination, setDestination] = useState<LatLng | null>(
    initialDestination
  );

  // Cargar config desde API
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/get-map/config/route");
        if (!res.ok)
          throw new Error("No se pudo obtener la configuración del mapa");
        const data: MapConfig = await res.json();
        if (!cancelled) setMapConfig(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error desconocido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Geolocalización
  useEffect(() => {
    if (operatorPositionProp) return;
    if (!("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setSelfPosition(coords);
      },
      (err) => {
        console.warn("Geolocation error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [operatorPositionProp]);

  // Inicializar el mapa
  useEffect(() => {
    const initMap = async () => {
      if (!mapContainerRef.current || !mapConfig || mapRef.current) return;

      await loadMapLibre();
      const maplibregl = (window as any).maplibregl;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapConfig.style,
        center: [-99.1332, 19.4326],
        zoom: 12,
        attributionControl: true,
        hash: false,
      });

      mapRef.current = map;

      // Controles
      map.addControl(
        new maplibregl.NavigationControl({ showCompass: true }),
        "top-right"
      );
      map.addControl(new maplibregl.ScaleControl({}), "bottom-left");
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showAccuracyCircle: true,
        }),
        "top-right"
      );

      map.on("load", () => {
        if (!map.getSource(ROUTE_SOURCE_ID)) {
          map.addSource(ROUTE_SOURCE_ID, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });
        }
        if (!map.getLayer(ROUTE_LAYER_ID)) {
          map.addLayer({
            id: ROUTE_LAYER_ID,
            type: "line",
            source: ROUTE_SOURCE_ID,
            paint: {
              "line-width": 4,
              "line-color": "#2563eb",
              "line-opacity": 0.8,
            },
          });
        }
      });
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapConfig]);

  // Operador marker
  useEffect(() => {
    if (!mapRef.current || !operatorPosition) return;
    const maplibregl = (window as any).maplibregl;
    const map = mapRef.current;

    if (!operatorMarkerRef.current) {
      operatorMarkerRef.current = new maplibregl.Marker({ color: "#16a34a" })
        .setLngLat([operatorPosition.lng, operatorPosition.lat])
        .setPopup(new maplibregl.Popup().setText("Operador"))
        .addTo(map);
    } else {
      operatorMarkerRef.current.setLngLat([
        operatorPosition.lng,
        operatorPosition.lat,
      ]);
    }
  }, [operatorPosition]);

  // Destino marker
  useEffect(() => {
    if (!mapRef.current || !destination) return;
    const maplibregl = (window as any).maplibregl;
    const map = mapRef.current;

    if (!destinationMarkerRef.current) {
      destinationMarkerRef.current = new maplibregl.Marker({ color: "#dc2626" })
        .setLngLat([destination.lng, destination.lat])
        .setPopup(new maplibregl.Popup().setText("Destino"))
        .addTo(map);
    } else {
      destinationMarkerRef.current.setLngLat([destination.lng, destination.lat]);
    }
  }, [destination]);

  // Pick destino
  useEffect(() => {
    if (!mapRef.current || disablePickDestination) return;
    const map = mapRef.current;
    const onClick = (e: any) => {
      const lngLat = e.lngLat as { lng: number; lat: number };
      const dest = { lat: lngLat.lat, lng: lngLat.lng };
      setDestination(dest);
      onDestinationChange?.(dest);
    };
    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  }, [disablePickDestination, onDestinationChange]);

  // Ruta simple
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource(ROUTE_SOURCE_ID) as any;
    if (!source) return;

    if (operatorPosition && destination) {
      const feature = {
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          coordinates: [
            [operatorPosition.lng, operatorPosition.lat],
            [destination.lng, destination.lat],
          ],
        },
        properties: {},
      };
      source.setData({
        type: "FeatureCollection",
        features: [feature],
      });

      if (autoFitBounds) {
        const bounds: any = [
          [operatorPosition.lng, operatorPosition.lat],
          [destination.lng, destination.lat],
        ];
        map.fitBounds(bounds, { padding: 80, duration: 600 });
      }
    } else {
      source.setData({
        type: "FeatureCollection",
        features: [],
      });
    }
  }, [operatorPosition, destination, autoFitBounds]);

  const distanceKm = useMemo(() => {
    if (!operatorPosition || !destination) return null;
    return haversineKm(operatorPosition, destination);
  }, [operatorPosition, destination]);

  const etaMinutes = useMemo(() => {
    if (!distanceKm || avgSpeedKmh <= 0) return null;
    return Math.round((distanceKm / avgSpeedKmh) * 60);
  }, [distanceKm, avgSpeedKmh]);

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center rounded-2xl border">
        Cargando mapa…
      </div>
    );
  }
  if (error || !mapConfig) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center rounded-2xl border text-red-600">
        Error cargando el mapa: {error ?? "configuración no disponible"}
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div
        ref={mapContainerRef}
        className="w-full h-[70vh] rounded-2xl border overflow-hidden"
      />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="px-2 py-1 rounded-full bg-gray-100">
          Mapa: {mapConfig.mapName} · Región: {mapConfig.region}
        </span>
        {operatorPosition && (
          <span className="px-2 py-1 rounded-full bg-green-100">
            Operador: {operatorPosition.lat.toFixed(5)},{" "}
            {operatorPosition.lng.toFixed(5)}
          </span>
        )}
        {destination ? (
          <span className="px-2 py-1 rounded-full bg-red-100">
            Destino: {destination.lat.toFixed(5)}, {destination.lng.toFixed(5)}
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full bg-yellow-100">
            Haz clic en el mapa para elegir el punto de entrega
          </span>
        )}
        {distanceKm != null && (
          <span className="px-2 py-1 rounded-full bg-blue-100">
            Distancia aprox.: {distanceKm.toFixed(2)} km
          </span>
        )}
        {etaMinutes != null && (
          <span className="px-2 py-1 rounded-full bg-indigo-100">
            ETA estimada: ~{etaMinutes} min
          </span>
        )}
      </div>
    </div>
  );
}
