// src/components/organism/OperatorMap/OperatorMap.tsx
"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

interface LatLng {
  lat: number;
  lng: number;
}

interface OperatorMapProps {
  currentLocation: LatLng | null;
  destination: LatLng | null;
  destinationAddress: string;
  route: LatLng[];
  isNavigating: boolean;
}

// Componente interno para centrar el mapa
const MapCenterUpdater = ({ center }: { center: LatLng | null }) => {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.whenReady(() => {
        map.setView([center.lat, center.lng], map.getZoom());
      });
    }
  }, [center, map]);
  return null;
};

const OperatorMap = ({
  currentLocation,
  destination,
  destinationAddress,
  route,
  isNavigating,
}: OperatorMapProps) => {
  // Fix para los íconos de Leaflet en producción
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((LModule) => {
        const L = LModule.default || LModule;
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      });
    }
  }, []); // El hook se ejecuta una vez al montar el componente.

  const initialPosition: LatLng = { lat: 22.1565, lng: -100.9855 };

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-200 rounded">
        Cargando mapa... Asegúrate de permitir la geolocalización.
      </div>
    );
  }

<<<<<<< HEAD
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
    };
  }, [getCurrentLocation, setCurrentLocation]);

  // Helper to get auth headers
  const getAuthHeaders = useCallback(() => {
    if (session?.accessToken) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      };
    }
    return { "Content-Type": "application/json" };
  }, [session]);

  // Search for destination address
  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch("/api/get-map/search", {
        method: "POST",
        headers: getAuthHeaders(), // Use auth headers
        body: JSON.stringify({ query: searchQuery, center: currentLocation ? [currentLocation.lng, currentLocation.lat] : undefined }),
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

  // Select a search result as destination
  const selectDestination = (result: SearchResult) => {
    const [lng, lat] = result.Place.Geometry.Point;
    setDestination({ lat, lng });
    setDestinationAddress(result.Place.Label);
    setSearchResults([]); // Clear search results
  };

  // Calculate and display route
  const calculateRoute = useCallback(async () => {
    if (!currentLocation || !destination) {
      toast.warn("Ubicación actual y destino son necesarios para calcular la ruta.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/get-map/route", {
        method: "POST",
        headers: getAuthHeaders(), // Use auth headers
        body: JSON.stringify({
          origin: { lat: currentLocation.lat, lng: currentLocation.lng },
          destination: { lat: destination.lat, lng: destination.lng },
        }),
      });
      const data = await response.json();
      if (response.ok && data.Legs && data.Legs.length > 0) {
        const newRoute: RouteStep[] = data.Legs[0].Geometry.LineString.map((point: [number, number]) => ({
          lng: point[0],
          lat: point[1],
        }));
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
  }, [currentLocation, destination, setLoading, setRoute, toast, getAuthHeaders]);

  useEffect(() => {
    if (currentLocation && destination && !isNavigating) {
      calculateRoute(); // Calculate route when location or destination changes, if not navigating
    }
  }, [currentLocation, destination, calculateRoute, isNavigating]);

  // Start/Stop Navigation
  const toggleNavigation = async () => {
    if (isNavigating) {
      // Stop navigation
      setIsNavigating(false);
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
      toast.info("Navegación detenida.");
    } else {
      // Start navigation
      if (!currentLocation || !destination) {
        toast.warn("Necesitas una ubicación actual y un destino para iniciar la navegación.");
        return;
      }
      await calculateRoute(); // Ensure route is calculated before starting
      setIsNavigating(true);
      toast.success("Navegación iniciada. Compartiendo ubicación en tiempo real.");

      // Start sending location updates
      trackingIntervalRef.current = setInterval(async () => {
        if (currentLocation) {
          try {
            await fetch("/api/location", {
              method: "POST",
              headers: getAuthHeaders(), // Use auth headers
              body: JSON.stringify({
                deviceId,
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
              }),
            });
            // console.log("Location updated for device:", deviceId);
          } catch (error) {
            console.error("Error sending location update:", error);
          }
        }
      }, 10000); // Update every 10 seconds
    }
  };

  // Component to center map on current location or destination
  const MapCenterUpdater = ({ center }: { center: LatLng | null }) => {
    const map = useMap();
    useEffect(() => {
      // Ensure both map and center are valid before attempting to set view
      if (map && center) {
        // Use map.whenReady to ensure the map is fully initialized
        map.whenReady(() => {
          map.setView([center.lat, center.lng], map.getZoom());
        });
      }
    }, [center, map]);
    return null;
  };
=======
  const routePositions: [number, number][] = route.map((step) => [
    step.lat,
    step.lng,
  ]);
>>>>>>> 8bb66d5 (Cambios temporales antes de cambiar de rama)

  return (
    <div style={{ height: "600px", width: "100%", borderRadius: "0.5rem" }}>
      <MapContainer
        center={[currentLocation.lat, currentLocation.lng]}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>Ubicación Actual del Operador</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>Destino: {destinationAddress}</Popup>
          </Marker>
        )}
        {routePositions.length > 0 && (
          <Polyline positions={routePositions} color="blue" />
        )}
        <MapCenterUpdater
          center={
            isNavigating ? currentLocation : destination || currentLocation
          }
        />
      </MapContainer>
    </div>
  );
};

export default OperatorMap;