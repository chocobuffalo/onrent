// src/hooks/useOperatorNavigation.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { Session } from "next-auth"; // Importar Session

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

export const useOperatorNavigation = (
  deviceId: string,
  session: Session | null
) => {
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [route, setRoute] = useState<RouteStep[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper para los encabezados de autenticación
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

  // Obtener y observar la ubicación del navegador
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error watching location:", error);
          toast.error(`Error al observar la ubicación: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      toast.error("Geolocalización no soportada por este navegador.");
    }
  }, []);

  // Función para buscar la dirección
  const handleSearch = async () => {
    if (!searchQuery) return;
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
      } else {
        toast.error(data.error || "Error al buscar la dirección.");
      }
    } catch (error) {
      console.error("Search API error:", error);
      toast.error("Error de conexión al buscar.");
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular la ruta
  const calculateRoute = useCallback(async () => {
    if (!currentLocation || !destination) {
      toast.warn(
        "Ubicación actual y destino son necesarios para calcular la ruta."
      );
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
        const newRoute: RouteStep[] = data.Legs[0].Geometry.LineString.map(
          (point: [number, number]) => ({
            lng: point[0],
            lat: point[1],
          })
        );
        setRoute(newRoute);
        toast.success("Ruta calculada con éxito.");
      } else {
        setRoute([]);
        toast.error(data.error || "Error al calcular la ruta.");
      }
    } catch (error) {
      console.error("Route API error:", error);
      toast.error("Error de conexión al calcular la ruta.");
    } finally {
      setLoading(false);
    }
  }, [currentLocation, destination, getAuthHeaders]);

  // useEffect para calcular la ruta
  useEffect(() => {
    if (currentLocation && destination && !isNavigating) {
      calculateRoute();
    }
  }, [currentLocation, destination, calculateRoute, isNavigating]);

  // Función para iniciar/detener la navegación
  const toggleNavigation = useCallback(async () => {
    if (isNavigating) {
      setIsNavigating(false);
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
      toast.info("Navegación detenida.");
    } else {
      if (!currentLocation || !destination) {
        toast.warn(
          "Necesitas una ubicación actual y un destino para iniciar la navegación."
        );
        return;
      }
      await calculateRoute();
      setIsNavigating(true);
      toast.success("Navegación iniciada. Compartiendo ubicación.");

      trackingIntervalRef.current = setInterval(async () => {
        if (currentLocation) {
          try {
            await fetch("/api/location", {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify({
                deviceId,
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
              }),
            });
          } catch (error) {
            console.error("Error sending location update:", error);
          }
        }
      }, 10000); // 10 segundos
    }
  }, [
    isNavigating,
    currentLocation,
    destination,
    calculateRoute,
    deviceId,
    getAuthHeaders,
  ]);

  // Efecto para limpiar el intervalo al desmontar el componente
  useEffect(() => {
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, []);

  // Retornar los estados y las funciones
  return {
    currentLocation,
    destination,
    destinationAddress,
    route,
    isNavigating,
    searchQuery,
    searchResults,
    loading,
    setSearchQuery,
    selectDestination: (result: SearchResult) => {
      const [lng, lat] = result.Place.Geometry.Point;
      setDestination({ lat, lng });
      setDestinationAddress(result.Place.Label);
      setSearchResults([]);
    },
    handleSearch,
    calculateRoute,
    toggleNavigation,
  };
};