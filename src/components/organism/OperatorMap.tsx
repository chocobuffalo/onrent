"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMap } from "react-leaflet";
import { Session } from "next-auth"; // Add this import

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => {
    // Fix for Leaflet default icon issues - applied in a useEffect hook
    return mod.MapContainer;
  }),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

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
    Geometry: { Point: [number, number] }; // [lng, lat]
  };
}

interface OperatorMapProps {
  // State variables
  currentLocation: LatLng | null;
  setCurrentLocation: (location: LatLng | null) => void;
  destination: LatLng | null;
  setDestination: (location: LatLng | null) => void;
  destinationAddress: string;
  setDestinationAddress: (address: string) => void;
  route: RouteStep[];
  setRoute: (route: RouteStep[]) => void;
  isNavigating: boolean;
  setIsNavigating: (navigating: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  deviceId: string;
  session: Session | null; // Add the session prop
}

const OperatorMap = ({
  currentLocation,
  setCurrentLocation,
  destination,
  setDestination,
  destinationAddress,
  setDestinationAddress,
  route,
  setRoute,
  isNavigating,
  setIsNavigating,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  loading,
  setLoading,
  deviceId,
  session, // Destructure session prop
}: OperatorMapProps) => {
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Leaflet icon fix for client-side rendering
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((LModule) => {
        const L = LModule.default || LModule; // Handle commonjs vs esm import
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      }).catch(error => console.error("Error loading Leaflet for icon fix:", error));
    }
  }, []); // Run once on mount

  // Get current GPS location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
          toast.error("No se pudo obtener la ubicación actual.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      toast.error("Geolocalización no soportada por este navegador.");
    }
  }, [setCurrentLocation]);

  useEffect(() => {
    getCurrentLocation(); // Get initial location
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error watching location:", error);
        toast.error(`Error al observar la ubicación: ${error.message || error.code || JSON.stringify(error)}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
    };
  }, [getCurrentLocation, setCurrentLocation]);

  // Helper to get auth headers
  const getAuthHeaders = useCallback(() => {
    const sessionWithToken = session as any; // Type assertion for flexibility
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (sessionWithToken?.accessToken) {
      headers["Authorization"] = `Bearer ${sessionWithToken.accessToken}`;
    }
    
    return headers;
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Navegación del Operador</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Destino</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="border p-2 flex-grow"
            placeholder="Buscar dirección de la obra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            disabled={isNavigating}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading || isNavigating}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
        {searchResults.length > 0 && (
          <ul className="border rounded mt-2 max-h-40 overflow-y-auto bg-white">
            {searchResults.map((result, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => selectDestination(result)}
              >
                {result.Place.Label}
              </li>
            ))}
          </ul>
        )}
        {destinationAddress && (
          <p className="mt-2">
            **Destino Seleccionado:** {destinationAddress} (
            {destination?.lat.toFixed(4)}, {destination?.lng.toFixed(4)})
          </p>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={toggleNavigation}
          className={`px-6 py-3 rounded text-white font-bold ${
            isNavigating ? "bg-red-600" : "bg-green-600"
          } disabled:opacity-50`}
          disabled={!currentLocation || !destination || loading}
        >
          {isNavigating ? "Detener Navegación" : "Iniciar Navegación"}
        </button>
        {isNavigating && (
          <button
            onClick={calculateRoute}
            className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            Recalcular Ruta
          </button>
        )}
      </div>

      <div style={{ height: "600px", width: "100%", borderRadius: "0.5rem" }}>
        {mounted && currentLocation ? (
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
            {route.length > 0 && (
              <Polyline
                positions={route.map((step) => [step.lat, step.lng])}
                color="blue"
              />
            )}
            <MapCenterUpdater center={isNavigating ? currentLocation : destination || currentLocation} />
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 rounded">
            Cargando mapa... Asegúrate de permitir la geolocalización.
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorMap;