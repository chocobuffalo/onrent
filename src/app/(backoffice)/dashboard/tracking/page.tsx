"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import OperatorMap from "@/components/organism/OperatorMap";
import { useSession } from "next-auth/react"; // Correct import for useSession

// Importa el organismo de forma dinámica para evitar problemas de SSR con Leaflet
const MapWithTracking = dynamic(
  () => import("@/components/organism/MapWithTracking/MapWithTracking").then(mod => mod.MapWithTracking),
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

const TrackingPage = () => {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role; // Access the role from the session

  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [route, setRoute] = useState<RouteStep[]>([]);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Placeholder deviceId - in a real app, this would come from user session/machine assignment
  const deviceId = "operator-machine-123";
  
  // Cambia la URL por la de tu backend de Socket.IO
  const SOCKET_SERVER_URL = "http://localhost:3001";

  if (status === "loading") {
    return <div className="container mx-auto p-4">Cargando sesión...</div>;
  }

  if (userRole === "proveedor") {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Panel de Operador</h1>
        
        {/* Mapa de navegación del operador */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Navegación</h2>
          <OperatorMap
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            destination={destination}
            setDestination={setDestination}
            destinationAddress={destinationAddress}
            setDestinationAddress={setDestinationAddress}
            route={route}
            setRoute={setRoute}
            isNavigating={isNavigating}
            setIsNavigating={setIsNavigating}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            loading={loading}
            setLoading={setLoading}
            deviceId={deviceId}
            session={session} // Pass the session object
          />
        </div>

        {/* Tracking en tiempo real de máquinas */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tracking en tiempo real de máquinas</h2>
          <MapWithTracking serverUrl={SOCKET_SERVER_URL} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Seguimiento de Flota</h1>
        
        {/* Usuarios no proveedores solo ven el tracking en tiempo real */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tracking en tiempo real de máquinas</h2>
          <MapWithTracking serverUrl={SOCKET_SERVER_URL} />
        </div>
      </div>
    );
  }
};

export default TrackingPage;