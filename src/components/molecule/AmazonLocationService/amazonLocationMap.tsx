"use client";
import { useEffect, useRef, useState, useCallback } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  placeId?: string;
}

interface AmazonLocationMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  width?: string;
  className?: string;
  onLocationSelect?: (coordinates: LocationData) => void;
  initialLocation?: LocationData | null;
  showLocationInfo?: boolean;
  showSearchField?: boolean;
  searchPlaceholder?: string;
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
  onLocationSelect,
  initialLocation = null,
  showLocationInfo = true,
  showSearchField = true,
  searchPlaceholder = "Buscar dirección, ciudad o punto de referencia..."
}: AmazonLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);

  // Estados para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [suppressNextSearch, setSuppressNextSearch] = useState(false); // 🔑 para no re-disparar búsqueda tras selección

  // Estados para la ubicación
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(initialLocation);
  const [isDragging, setIsDragging] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Cargar MapLibre GL
  const loadMapLibre = useCallback(() => {
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
  }, []);

  // Geocodificación inversa
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'User-Agent': 'OnRentX/1.0' } }
      );

      if (response.ok) {
        const data = await response.json();
        return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }

    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }, []);

  // Actualizar ubicación seleccionada (cierra dropdown y evita búsqueda automática)
  const updateSelectedLocation = useCallback(async (lat: number, lng: number, address?: string) => {
    let finalAddress = address;
    if (!finalAddress) {
      finalAddress = await reverseGeocode(lat, lng);
    }

    const locationData: LocationData = { lat, lng, address: finalAddress };
    setSelectedLocation(locationData);

    // 🔑 Evitar que el debounce dispare una nueva búsqueda por este setSearchQuery
    setSuppressNextSearch(true);
    setSearchQuery(finalAddress || '');

    // 🔑 Cerrar y limpiar sugerencias
    setShowResults(false);
    setSearchResults([]);

    onLocationSelect?.(locationData);
  }, [reverseGeocode, onLocationSelect]);

  // Actualizar marcador
  const updateMarker = useCallback((lat: number, lng: number) => {
    if (!map.current || !window.maplibregl) return;
    if (marker.current) marker.current.remove();

    marker.current = new window.maplibregl.Marker({
      color: '#FF6B35',
      draggable: true
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    marker.current.on('dragstart', () => setIsDragging(true));
    marker.current.on('dragend', async () => {
      setIsDragging(false);
      const newCoords = marker.current.getLngLat();
      await updateSelectedLocation(newCoords.lat, newCoords.lng);
    });

    map.current.flyTo({ center: [lng, lat], zoom: Math.max(map.current.getZoom(), 15), duration: 1000 });
  }, [updateSelectedLocation]);

  // Clic en el mapa
  const handleMapClick = useCallback(async (e: any) => {
    if (isDragging) return;
    const { lat, lng } = e.lngLat;
    updateMarker(lat, lng);
    await updateSelectedLocation(lat, lng);
  }, [isDragging, updateMarker, updateSelectedLocation]);

  // Inicializar mapa
  useEffect(() => {
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
          center: initialLocation ? [initialLocation.lng, initialLocation.lat] : center,
          zoom: initialLocation ? 15 : zoom,
        });

        map.current.addControl(new window.maplibregl.NavigationControl(), "top-left");
        map.current.on('click', handleMapClick);

        map.current.on('load', () => {
          setMapLoaded(true);
          if (initialLocation) {
            updateMarker(initialLocation.lat, initialLocation.lng);
            // Evita que se vuelva a abrir el dropdown por este setSearchQuery
            setSuppressNextSearch(true);
            setSearchQuery(initialLocation.address || '');
          }
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
        marker.current = null;
      }
    };
  }, [center, zoom, initialLocation, handleMapClick, updateMarker, loadMapLibre]);

  // Buscar lugares (AWS primero, fallback Nominatim)
  const searchPlaces = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_AWS_KEY;
      const region = "us-east-2";
      const indexName = "Ubicacion_obra";

      if (apiKey) {
        try {
          const response = await fetch(
            `https://places.geo.${region}.amazonaws.com/places/v0/indexes/${indexName}/search/text?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ Text: query, MaxResults: 5, BiasPosition: center }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setSearchResults(data.Results || []);
            setShowResults((data.Results || []).length > 0);
            return;
          }
        } catch (awsError) {
          console.warn('AWS Location Service failed, falling back to Nominatim:', awsError);
        }
      }

      // Fallback Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        { headers: { 'User-Agent': 'OnRentX/1.0' } }
      );

      if (response.ok) {
        const data = await response.json();
        const results = data.map((item: any) => ({
          Place: {
            Label: item.display_name,
            Geometry: { Point: [parseFloat(item.lon), parseFloat(item.lat)] },
            Country: item.address?.country || item.address?.country_code
          }
        }));
        setSearchResults(results);
        setShowResults(results.length > 0);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  }, [center]);

  // Seleccionar resultado (cerrar y suprimir siguiente búsqueda)
  const selectSearchResult = useCallback(async (result: any) => {
    const coords = result.Place.Geometry.Point;
    const lat = coords[1];
    const lng = coords[0];
    const address = result.Place.Label;

    updateMarker(lat, lng);
    await updateSelectedLocation(lat, lng, address);

    // 🔑 cerrar dropdown y limpiar
    setShowResults(false);
    setSearchResults([]);

    // 🔑 no dispares debounce por el setSearchQuery programático
    setSuppressNextSearch(true);
  }, [updateMarker, updateSelectedLocation]);

  // Debounce de búsqueda (respeta suppressNextSearch)
  useEffect(() => {
    if (suppressNextSearch) {
      // Consumimos la supresión y NO buscamos en este ciclo
      setSuppressNextSearch(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (searchQuery && showSearchField) {
        searchPlaces(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchPlaces, showSearchField, suppressNextSearch]);

  // Limpiar ubicación (también cerrar dropdown)
  const clearLocation = useCallback(() => {
    setSelectedLocation(null);
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
    setSuppressNextSearch(true); // evita búsqueda con cadena vacía por el debounce
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
    onLocationSelect?.({ lat: 0, lng: 0 });
  }, [onLocationSelect]);

  return (
    <div className="relative">
      {/* Información de ubicación seleccionada */}
      {selectedLocation && showLocationInfo && (
        <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-1 bg-orange-500 rounded-full">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Ubicación de la obra</p>
                <p className="text-xs text-gray-700 mt-1 break-words">
                  {selectedLocation.address || "Ubicación personalizada"}
                </p>
                <p className="text-xs text-orange-700 mt-1 font-mono">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <button
              onClick={clearLocation}
              className="ml-2 text-xs text-orange-600 hover:text-orange-800 underline flex-shrink-0"
            >
              Cambiar
            </button>
          </div>
        </div>
      )}

      {/* Mapa */}
      <div
        ref={mapContainer}
        style={{ height, width }}
        className={`rounded-lg overflow-hidden border shadow-sm ${className} ${!mapLoaded ? 'bg-gray-100' : ''}`}
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        )}
      </div>

      {/* Barra de búsqueda (debajo del mapa) */}
      {showSearchField && (
        <div className="relative mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Si el usuario edita manualmente, permitimos búsqueda
                // (no tocamos suppressNextSearch aquí)
              }}
              onFocus={() => setShowResults(searchResults.length > 0)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)} // ayuda a cerrar tras click
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              disabled={!mapLoaded}
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
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onMouseDown={(e) => e.preventDefault()} // evita perder el foco antes del click
                  onClick={() => selectSearchResult(result)}
                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{result.Place.Label}</p>
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
      )}

      {/* Exponer el searchQuery */}
      <input type="hidden" value={searchQuery} />
    </div>
  );
}
