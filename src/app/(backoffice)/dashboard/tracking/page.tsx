"use client";

import { useState } from "react";
import OperatorMap from "@/components/organism/OperatorMap";
import { useSession } from "next-auth/react"; // Correct import for useSession

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

  if (status === "loading") {
    return <div className="container mx-auto p-4">Cargando sesión...</div>;
  }

  if (userRole === "proveedor") {
    return (
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
    );
  } else {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Seguimiento de Flota</h1>
        <p>No tienes permisos para ver esta página.</p>
      </div>
    );
  }
};

export default TrackingPage;
