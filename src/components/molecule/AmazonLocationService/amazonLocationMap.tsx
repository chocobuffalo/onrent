"use client";
import { useEffect, useRef } from 'react';

interface AmazonLocationMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  width?: string;
  className?: string;
  onLocationSelect?: (coordinates: { lat: number; lng: number }) => void;
}

declare global {
  interface Window {
    maplibregl: any;
  }
}

export default function AmazonLocationMap({
  center = [-123.115898, 49.295868],
  zoom = 11,
  height = "400px",
  width = "100%",
  className = "",
  onLocationSelect
}: AmazonLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    const loadMapLibre = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.maplibregl) {
          resolve();
          return;
        }

        const cssLink = document.createElement('link');
        cssLink.href = 'https://unpkg.com/maplibre-gl@3.x/dist/maplibre-gl.css';
        cssLink.rel = 'stylesheet';
        document.head.appendChild(cssLink);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/maplibre-gl@3.x/dist/maplibre-gl.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load MapLibre GL JS'));
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        await loadMapLibre();

        if (map.current || !mapContainer.current) return;

        const apiKey = process.env.NEXT_PUBLIC_AWS_KEY;

        if (!apiKey) {
          console.error('AWS_KEY not found in environment variables');
          return;
        }

        const mapName = "Ubicacion_obra";
        const region = "us-east-2";

        map.current = new window.maplibregl.Map({
          container: mapContainer.current,
          style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
          center: center,
          zoom: zoom,
        });

        map.current.addControl(new window.maplibregl.NavigationControl(), "top-left");

        if (onLocationSelect) {
          map.current.on('click', (e: any) => {
            const coordinates = {
              lat: e.lngLat.lat,
              lng: e.lngLat.lng
            };
            onLocationSelect(coordinates);
          });
        }

      } catch (error) {
        console.error('Error initializing Amazon Location Service map:', error);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, onLocationSelect]);

  return (
    <div
      ref={mapContainer}
      style={{ height, width }}
      className={`rounded-lg overflow-hidden border ${className}`}
    />
  );
}
