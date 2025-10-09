import { useEffect, useRef, useState, useCallback } from 'react';
import { LocationData, SearchResult } from '@/components/organism/AmazonLocationService/map';


interface UseAmazonLocationMapProps {
  center: [number, number];
  zoom: number;
  initialLocation: LocationData | null;
  onLocationSelect?: (coordinates: LocationData) => void;
}


export function useAmazonLocationMap({
  center,
  zoom,
  initialLocation,
  onLocationSelect
}: UseAmazonLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);


  // Estados para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [suppressNextSearch, setSuppressNextSearch] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);


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


  // Geocodificación inversa usando API route
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch('/api/get-map/reverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
    });



      if (response.ok) {
        const data = await response.json();
        return data.address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }


    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }, []);


  // Actualizar ubicación seleccionada
  const updateSelectedLocation = useCallback(async (lat: number, lng: number, address?: string) => {
    let finalAddress = address;
    if (!finalAddress) {
      finalAddress = await reverseGeocode(lat, lng);
    }


    const locationData: LocationData = { lat, lng, address: finalAddress };
    setSelectedLocation(locationData);


    setSuppressNextSearch(true);
    setSearchQuery(finalAddress || '');
    setIsUserTyping(false);


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


  // Buscar lugares usando API route
  const searchPlaces = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);


   try {
    const response = await fetch('/api/get-map/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, center })
    });


      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.Results || []);
        if (isUserTyping) {
          setShowResults((data.Results || []).length > 0);
        }
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
  }, [center, isUserTyping]);


  // Seleccionar resultado
  const selectSearchResult = useCallback(async (result: SearchResult) => {
    const coords = result.Place.Geometry.Point;
    const lat = coords[1];
    const lng = coords[0];
    const address = result.Place.Label;


    updateMarker(lat, lng);
    await updateSelectedLocation(lat, lng, address);


    setShowResults(false);
    setSearchResults([]);
    setSuppressNextSearch(true);
    setIsUserTyping(false);
  }, [updateMarker, updateSelectedLocation]);


  // Limpiar ubicación
  const clearLocation = useCallback(() => {
    setSelectedLocation(null);
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
    setSuppressNextSearch(true);
    setIsUserTyping(false);
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
    onLocationSelect?.({ lat: 0, lng: 0 });
  }, [onLocationSelect]);


  // Inicializar mapa
  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadMapLibre();
        if (map.current || !mapContainer.current) return;


        // Obtener configuración del mapa desde API route
        const response = await fetch('/api/get-map/config/route');
        if (!response.ok) {
          throw new Error(`Failed to fetch map config: ${response.status}`);
        }


        const config = await response.json();


        map.current = new window.maplibregl.Map({
          container: mapContainer.current,
          style: config.style,
          center: initialLocation ? [initialLocation.lng, initialLocation.lat] : center,
          zoom: initialLocation ? 15 : zoom,
        });


        map.current.addControl(new window.maplibregl.NavigationControl(), "top-left");
        map.current.on('click', handleMapClick);


        map.current.on('load', () => {
          setMapLoaded(true);
          if (initialLocation) {
            updateMarker(initialLocation.lat, initialLocation.lng);
            setSuppressNextSearch(true);
            setSearchQuery(initialLocation.address || '');
            setIsUserTyping(false);
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


  // Debounce de búsqueda - CORREGIDO
  useEffect(() => {
    if (suppressNextSearch) {
      setSuppressNextSearch(false);
      return;
    }

    // CAMBIO CRÍTICO: Solo ejecutar búsqueda si el usuario está escribiendo activamente
    if (!isUserTyping) {
      return;
    }


    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchPlaces(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);


    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchPlaces, suppressNextSearch, isUserTyping]);


  return {
    mapContainer,
    selectedLocation,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    mapLoaded,
    selectSearchResult,
    clearLocation,
    setIsUserTyping
  };
}
