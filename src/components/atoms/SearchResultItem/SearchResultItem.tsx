import { SearchResult } from "@/components/organism/AmazonLocationService/map";

interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
}

export default function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
    >
      <div className="flex items-start gap-3">
        <svg className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{result.Place.Label}</p>
          {result.Place.Country && (
            <p className="text-xs text-gray-500">{result.Place.Country}</p>
          )}
        </div>
      </div>
    </div>
  );
}
