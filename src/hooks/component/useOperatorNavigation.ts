// src/hooks/component/useOperatorNavigation.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { Session } from "next-auth";

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteStep {
  lat: number;
  lng: number;
}

interface SearchResult {
  Place: {
    Label: string;
    Geometry: { Point: [number, number] };
  };
}

interface NavigationState {
  isActive: boolean;
  startTime: string | null;
  totalDistance: number | null;
  estimatedDuration: number | null;
}

export const useOperatorNavigation = (
  deviceId: string,
  session: Session | null
) => {
  // Estados básicos
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [route, setRoute] = useState<RouteStep[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados de navegación
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isActive: false,
    startTime: null,
    totalDistance: null,
    estimatedDuration: null
  });

  // Referencias para intervalos
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const locationWatchRef = useRef<number | null>(null);

  // Helper para headers de autenticación
  const getAuthHeaders = useCallback(() => {
    const sessionWithToken = session as any;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (sessionWithToken?.accessToken) {
      headers["Authorization"] = `Bearer ${sessionWithToken.accessToken}`;
    }
    return headers;
  }, [session]);

  // Obtener ubicación actual del navegador
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocalización no disponible en este navegador");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        setCurrentLocation(newLocation);
        
        // Si está navegando, enviar ubicación automáticamente
        if (navigationState.isActive) {
          sendLocationUpdate(newLocation);
        }
      },
      (error) => {
        console.error("Error watching location:", error);
        toast.error(`Error al obtener ubicación: ${error.message}`);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );

    locationWatchRef.current = watchId;

    return () => {
      if (locationWatchRef.current) {
        navigator.geolocation.clearWatch(locationWatchRef.current);
      }
    };
  }, [navigationState.isActive]);

  // Enviar actualización de ubicación al backend
  const sendLocationUpdate = useCallback(async (location: LatLng) => {
    if (!deviceId || !location) return;

    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          deviceId,
          latitude: location.lat,
          longitude: location.lng,
          entity_type: "operador",
          status: navigationState.isActive ? "navigating" : "available"
        }),
      });

      if (!response.ok) {
        console.error("Error sending location update:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending location update:", error);
    }
  }, [deviceId, getAuthHeaders, navigationState.isActive]);

  // Buscar direcciones
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      toast.warn("Ingresa una dirección para buscar");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/get-map/search", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          query: searchQuery,
          center: currentLocation
            ? [currentLocation.lng, currentLocation.lat]
            : undefined,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.Results) {
        setSearchResults(data.Results);
        if (data.Results.length === 0) {
          toast.info("No se encontraron resultados para la búsqueda");
        }
      } else {
        toast.error(data.error || "Error al buscar la dirección");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search API error:", error);
      toast.error("Error de conexión al buscar");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentLocation, getAuthHeaders]);

  // Calcular ruta
  const calculateRoute = useCallback(async () => {
    if (!currentLocation || !destination) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/get-map/route", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          origin: { lat: currentLocation.lat, lng: currentLocation.lng },
          destination: { lat: destination.lat, lng: destination.lng },
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.Legs && data.Legs.length > 0) {
        const leg = data.Legs[0];
        
        // Extraer la ruta
        const newRoute: RouteStep[] = leg.Geometry.LineString.map(
          (point: [number, number]) => ({
            lng: point[0],
            lat: point[1],
          })
        );
        
        setRoute(newRoute);
        
        // Actualizar información de la ruta
        setNavigationState(prev => ({
          ...prev,
          totalDistance: leg.Distance || null,
          estimatedDuration: leg.DurationSeconds || null
        }));
        
        toast.success("Ruta calculada exitosamente");
      } else {
        setRoute([]);
        toast.error(data.error || "Error al calcular la ruta");
      }
    } catch (error) {
      console.error("Route API error:", error);
      toast.error("Error de conexión al calcular la ruta");
      setRoute([]);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, destination, getAuthHeaders]);

  // Iniciar/detener navegación
  const toggleNavigation = useCallback(async () => {
    if (!currentLocation) {
      toast.warn("Necesitas permitir el acceso a tu ubicación");
      return;
    }

    if (!destination) {
      toast.warn("Selecciona un destino para iniciar la navegación");
      return;
    }

    if (navigationState.isActive) {
      // Detener navegación
      setNavigationState(prev => ({
        ...prev,
        isActive: false,
        startTime: null
      }));

      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }

      // Enviar estado final
      await sendLocationUpdate(currentLocation);
      
      toast.info("Navegación detenida");
    } else {
      // Iniciar navegación
      await calculateRoute();
      
      setNavigationState(prev => ({
        ...prev,
        isActive: true,
        startTime: new Date().toISOString()
      }));

      // Enviar ubicación inicial
      await sendLocationUpdate(currentLocation);
      
      // Configurar envío periódico de ubicación
      trackingIntervalRef.current = setInterval(async () => {
        if (currentLocation) {
          await sendLocationUpdate(currentLocation);
        }
      }, 10000); // Cada 10 segundos

      toast.success("Navegación iniciada. Compartiendo ubicación en tiempo real");
    }
  }, [
    currentLocation,
    destination,
    navigationState.isActive,
    calculateRoute,
    sendLocationUpdate,
  ]);

  // Seleccionar destino desde resultados de búsqueda
  const selectDestination = useCallback((result: SearchResult) => {
    const [lng, lat] = result.Place.Geometry.Point;
    setDestination({ lat, lng });
    setDestinationAddress(result.Place.Label);
    setSearchResults([]);
    setSearchQuery(result.Place.Label);
  }, []);

  // Obtener destino de obra por order_id
  const loadDestinationFromOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/destination`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      
      if (response.ok && data.destination) {
        setDestination({
          lat: data.destination.latitude,
          lng: data.destination.longitude
        });
        setDestinationAddress(data.destination.address || "Obra destino");
        toast.success("Destino de la obra cargado");
      } else {
        toast.error(data.error || "No se pudo cargar el destino de la obra");
      }
    } catch (error) {
      console.error("Error loading destination:", error);
      toast.error("Error al cargar destino de la obra");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
      if (locationWatchRef.current) {
        navigator.geolocation.clearWatch(locationWatchRef.current);
      }
    };
  }, []);

  // Auto-calcular ruta cuando cambian ubicación o destino
  useEffect(() => {
    if (currentLocation && destination && !navigationState.isActive) {
      calculateRoute();
    }
  }, [currentLocation, destination, navigationState.isActive]);

  return {
    // Estados básicos
    currentLocation,
    destination,
    destinationAddress,
    route,
    searchQuery,
    searchResults,
    loading,
    
    // Estados de navegación
    navigationState,
    isNavigating: navigationState.isActive,
    
    // Acciones
    setSearchQuery,
    selectDestination,
    handleSearch,
    calculateRoute,
    toggleNavigation,
    loadDestinationFromOrder,
    
    // Información de la ruta
    routeDistance: navigationState.totalDistance,
    estimatedDuration: navigationState.estimatedDuration,
    navigationStartTime: navigationState.startTime,
  };
};