"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OperatorMap from "@/components/organism/OperatorMap"; // Import the new component
import { useSession } from "next-auth/react"; // Import useSession

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

const OperatorNavigationPage = () => {
  const { data: session } = useSession(); // Get session data

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
};

export default OperatorNavigationPage;