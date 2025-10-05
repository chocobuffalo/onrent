import { SearchResult } from '@/components/organism/AmazonLocationService/map';
import SearchInput from '@/components/atoms/SearchInput/SearchInput';
import SearchResults from '@/components/molecule/SearchResults/SearchResults';

interface SearchSectionProps {
  placeholder: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  mapLoaded: boolean;
  onSelectResult: (result: SearchResult) => void;
}

export default function SearchSection({
  placeholder,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  showResults,
  setShowResults,
  mapLoaded,
  onSelectResult
}: SearchSectionProps) {
  
  const handleEnter = () => {
    // Seleccionar el primer resultado cuando se presiona Enter
    if (searchResults.length > 0) {
      onSelectResult(searchResults[0]);
      setShowResults(false);
    }
  };

  return (
    <div className="relative mt-4">
      <SearchInput
        placeholder={placeholder}
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value);
          // Mostrar resultados solo si está escribiendo
          if (value.trim().length > 0 && searchResults.length > 0) {
            setShowResults(true);
          }
        }}
        onFocus={() => {
          // Solo abrir si hay query actual y resultados disponibles
          if (searchQuery.trim().length > 2 && searchResults.length > 0) {
            setShowResults(true);
          }
        }}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        onEnter={handleEnter}
        isLoading={isSearching}
        disabled={!mapLoaded}
      />

      {showResults && (
        <SearchResults
          results={searchResults}
          onSelectResult={(result) => {
            onSelectResult(result);
            setShowResults(false);
          }}
        />
      )}
    </div>
  );
}