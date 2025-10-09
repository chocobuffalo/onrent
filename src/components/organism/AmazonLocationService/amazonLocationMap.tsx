"use client";
import { AmazonLocationMapProps } from './map';
import { useAmazonLocationMap } from '../../../hooks/component/useAmazonLocationMap';
import LocationInfo from '@/components/atoms/LocationInfo/LocationInfo';
import MapLoading from '@/components/atoms/MapLoading/MapLoading';
import SearchSection from '../SearchSection/SearchSection';


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
  const {
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
  } = useAmazonLocationMap({
    center,
    zoom,
    initialLocation,
    onLocationSelect
  });


  return (
    <div className="relative">
      {selectedLocation && showLocationInfo && (
        <LocationInfo
          location={selectedLocation}
          onClear={clearLocation}
        />
      )}


      <div
        ref={mapContainer}
        style={{ height, width }}
        className={`rounded-lg overflow-hidden border shadow-sm ${className} ${!mapLoaded ? 'bg-gray-100' : ''}`}
      >
        {!mapLoaded && <MapLoading />}
      </div>


      {showSearchField && (
        <SearchSection
          placeholder={searchPlaceholder}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          showResults={showResults}
          setShowResults={setShowResults}
          mapLoaded={mapLoaded}
          onSelectResult={selectSearchResult}
          setIsUserTyping={setIsUserTyping}
        />
      )}
    </div>
  );
}
