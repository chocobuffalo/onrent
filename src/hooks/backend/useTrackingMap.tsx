"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { DeviceLocation } from "@/components/molecule/TrackingMap/TrackingMap";

/**
 * Props del hook
 */
interface UseTrackingMapProps {
  operatorPosition?: DeviceLocation | null; // Posición inicial del operador
  initialDestination?: { lat: number; lng: number } | null; // Destino de la ruta
  fleet?: DeviceLocation[]; // Otros vehículos / maquinaria
  simulationSpeed?: number; // Tiempo en milisegundos entre pasos de simulación
}

export function useTrackingMap({
  operatorPosition,
  initialDestination,
  fleet,
  simulationSpeed = 1000, // default 1 segundo entre pasos
}: UseTrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null); // Contenedor del mapa
  const mapRef = useRef<any>(null); // Instancia del mapa MapLibre
  const markersRef = useRef<any[]>([]); // Marcadores de flota y destino
  const operatorMarkerRef = useRef<any>(null); // Marcador del operador que se mueve
  const routeLineRef = useRef<any>(null); // Línea de la ruta
  const [mapLoaded, setMapLoaded] = useState(false); // Indica si el mapa cargó

  /**
   * Carga MapLibre GL dinámicamente
   */
  const loadMapLibre = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.maplibregl) { resolve(); return; }

      // CSS MapLibre
      const cssLink = document.createElement("link");
      cssLink.href = "https://unpkg.com/maplibre-gl@3.x/dist/maplibre-gl.css";
      cssLink.rel = "stylesheet";
      document.head.appendChild(cssLink);

      // Script MapLibre
      const script = document.createElement("script");
      script.src = "https://unpkg.com/maplibre-gl@3.x/dist/maplibre-gl.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load MapLibre GL JS"));
      document.head.appendChild(script);
    });
  }, []);

  /**
   * Crea un marcador en el mapa
   * @param lat Latitud
   * @param lng Longitud
   * @param color Color del marcador
   * @returns El objeto Marker
   */
  const addMarker = useCallback((lat: number, lng: number, color: string = "blue") => {
    if (!mapRef.current || !window.maplibregl) return;
    const marker = new window.maplibregl.Marker({ color })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
    markersRef.current.push(marker);
    return marker;
  }, []);

  /**
   * Dibuja la ruta entre origen y destino usando la API de route
   * @returns Array de coordenadas de la ruta
   */
  const drawRoute = useCallback(async (origin: { lat: number, lng: number }, destination: { lat: number, lng: number }) => {
    if (!mapRef.current) return [];

    try {
      const res = await fetch("/api/get-map/route/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination }),
      });

      if (!res.ok) throw new Error("Failed to fetch route");

      const data = await res.json();
      const routeCoordinates = data?.Legs?.[0]?.Geometry?.LineString || [];

      // Elimina ruta previa si existe
      if (routeLineRef.current) {
        if (mapRef.current.getSource("route")) {
          mapRef.current.removeLayer("route");
          mapRef.current.removeSource("route");
        }
        routeLineRef.current = null;
      }

      // Dibuja nueva ruta
      if (routeCoordinates.length > 0) {
        mapRef.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: routeCoordinates },
          },
        });

        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#FF6B35", "line-width": 4 },
        });

        routeLineRef.current = "route";
      }

      return routeCoordinates;
    } catch (err) {
      console.error("Error drawing route:", err);
      return [];
    }
  }, []);

  /**
   * Inicializa el mapa y los marcadores
   */
  useEffect(() => {
    const initializeMap = async () => {
      await loadMapLibre();
      if (!mapContainerRef.current || mapRef.current) return;

      const initialCenter: [number, number] = operatorPosition
        ? [operatorPosition.lng, operatorPosition.lat]
        : [-99.1332, 19.4326]; // Centro default (CDMX)

      // Configuración de estilo del mapa
      const response = await fetch("/api/get-map/config/route");
      const config = await response.json();

      mapRef.current = new window.maplibregl.Map({
        container: mapContainerRef.current,
        style: config.style,
        center: initialCenter,
        zoom: 13,
      });

      mapRef.current.addControl(new window.maplibregl.NavigationControl(), "top-left");

      mapRef.current.on("load", async () => {
        setMapLoaded(true);

        // Marcador del operador (azul)
        if (operatorPosition) {
          operatorMarkerRef.current = addMarker(operatorPosition.lat, operatorPosition.lng, "blue");
        }

        // Marcador del destino (rojo)
        if (initialDestination) addMarker(initialDestination.lat, initialDestination.lng, "red");

        // Marcadores de la flota (verde)
        if (fleet && fleet.length > 0) {
          fleet.forEach(machine => addMarker(machine.lat, machine.lng, "green"));
        }

        // Dibuja la ruta y simula movimiento del operador
        if (operatorPosition && initialDestination) {
          const routeCoords = await drawRoute(operatorPosition, initialDestination);

          if (routeCoords.length > 0 && operatorMarkerRef.current) {
            let index = 0;
            const moveOperator = () => {
              if (index >= routeCoords.length) return;
              const [lng, lat] = routeCoords[index];
              // Mueve el marcador del operador
              operatorMarkerRef.current.setLngLat([lng, lat]);
              mapRef.current.flyTo({ center: [lng, lat], zoom: 15, duration: simulationSpeed });
              index++;
              setTimeout(moveOperator, simulationSpeed);
            };
            moveOperator();
          }
        }
      });
    };

    initializeMap();

    return () => {
      // Cleanup del mapa y marcadores
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      operatorMarkerRef.current = null;
      routeLineRef.current = null;
    };
  }, [operatorPosition, initialDestination, fleet, loadMapLibre, addMarker, drawRoute, simulationSpeed]);

  return mapContainerRef;
}
