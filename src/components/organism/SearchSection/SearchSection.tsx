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
  return (
    <div className="relative mt-4">
      <SearchInput
        placeholder={placeholder}
        value={searchQuery}
        onChange={setSearchQuery}
        onFocus={() => setShowResults(searchResults.length > 0)}
        onBlur={() => setTimeout(() => setShowResults(false), 150)}
        isLoading={isSearching}
        disabled={!mapLoaded}
      />

      {showResults && (
        <SearchResults
          results={searchResults}
          onSelectResult={onSelectResult}
        />
      )}
    </div>
  );
}
