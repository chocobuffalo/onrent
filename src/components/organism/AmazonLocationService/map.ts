export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  placeId?: string;
}

export interface AmazonLocationMapProps {
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

export interface SearchResult {
  Place: {
    Label: string;
    Geometry: {
      Point: [number, number];
    };
    Country?: string;
  };
}

declare global {
  interface Window {
    maplibregl: any;
  }
}
