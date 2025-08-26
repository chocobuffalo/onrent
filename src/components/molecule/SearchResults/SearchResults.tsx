import { SearchResult } from '@/components/organism/AmazonLocationService/map';
import SearchResultItem from '@/components/atoms/SearchResultItem/SearchResultItem';

interface SearchResultsProps {
  results: SearchResult[];
  onSelectResult: (result: SearchResult) => void;
}

export default function SearchResults({ results, onSelectResult }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {results.map((result, index) => (
        <SearchResultItem
          key={index}
          result={result}
          onClick={() => onSelectResult(result)}
        />
      ))}
    </div>
  );
}
