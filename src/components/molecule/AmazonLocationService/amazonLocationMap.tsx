"use client";
import { useEffect, useRef, useState } from 'react';

interface AmazonLocationMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  width?: string;
  className?: string;
  onLocationSelect?: (coordinates: { lat: number; lng: number }, address?: string) => void;
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
  const marker = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address?: string} | null>(null);

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

        // Click event para seleccionar ubicación manualmente
        map.current.on('click', (e: any) => {
          const coordinates = {
            lat: e.lngLat.lat,
            lng: e.lngLat.lng
          };

          handleLocationSelection(coordinates, coordinates.lat, coordinates.lng);
        });

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
  }, [center, zoom]);

  // Función para buscar lugares usando OpenStreetMap Nominatim (alternativa gratuita)
  const searchPlacesAlternative = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'OnRentX/1.0' // Requerido por Nominatim
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const results = data.map((item: any) => ({
          Place: {
            Label: item.display_name,
            Geometry: {
              Point: [parseFloat(item.lon), parseFloat(item.lat)]
            },
            Country: item.address?.country || item.address?.country_code
          }
        }));

        setSearchResults(results);
        setShowResults(true);
      } else {
        console.error('Error searching places:', response.statusText);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Función para buscar lugares usando Amazon Location Service (requiere configuración adicional)
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_AWS_KEY;
      const region = "us-east-2";
      const indexName = "Ubicacion_obra"; // Necesitas crear un Place Index en AWS

      const response = await fetch(
        `https://places.geo.${region}.amazonaws.com/places/v0/indexes/${indexName}/search/text?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Text: query,
            MaxResults: 5,
            BiasPosition: center, // Bias hacia la posición actual
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.Results || []);
        setShowResults(true);
      } else {
        console.error('Error searching places:', response.statusText);
        // Fallback a Nominatim si AWS falla
        await searchPlacesAlternative(query);
      }
    } catch (error) {
      console.error('Error searching places with AWS:', error);
      // Fallback a Nominatim si AWS falla
      await searchPlacesAlternative(query);
    } finally {
      setIsSearching(false);
    }
  };

  // Función para manejar la selección de ubicación
  const handleLocationSelection = (coordinates: {lat: number, lng: number}, lat: number, lng: number, address?: string) => {
    setSelectedLocation({ lat, lng, address });

    // Actualizar marcador en el mapa
    if (marker.current) {
      marker.current.remove();
    }

    if (map.current && window.maplibregl) {
      marker.current = new window.maplibregl.Marker({ color: '#FF6B35' })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Centrar el mapa en la nueva ubicación
      map.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        duration: 1000
      });
    }

    // Callback al componente padre
    if (onLocationSelect) {
      onLocationSelect({ lat, lng }, address);
    }

    // Ocultar resultados de búsqueda
    setShowResults(false);
    setSearchQuery('');
  };

  // Función para seleccionar desde los resultados de búsqueda
  const selectSearchResult = (result: any) => {
    const coords = result.Place.Geometry.Point;
    const lat = coords[1];
    const lng = coords[0];
    const address = result.Place.Label;

    handleLocationSelection({ lat, lng }, lat, lng, address);
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchPlaces(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="relative">
      {/* Barra de búsqueda */}
      <div className="relative mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(searchResults.length > 0)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
            ) : (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            )}
          </div>
        </div>

        {/* Resultados de búsqueda */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => selectSearchResult(result)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{result.Place.Label}</p>
                    {result.Place.Country && (
                      <p className="text-xs text-gray-500">{result.Place.Country}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ubicación seleccionada */}
      {selectedLocation && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">Ubicación seleccionada</p>
              <p className="text-xs text-gray-600">
                {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mapa */}
      <div
        ref={mapContainer}
        style={{ height, width }}
        className={`rounded-lg overflow-hidden border ${className}`}
      />

      {/* Instrucciones */}
      <p className="text-xs text-gray-500 mt-2">
        💡 Busca una ubicación arriba o haz clic en el mapa para seleccionar un punto
      </p>
    </div>
  );
}
