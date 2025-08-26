import { LocationData } from "@/components/organism/AmazonLocationService/map";

interface LocationInfoProps {
  location: LocationData;
  onClear: () => void;
}

export default function LocationInfo({ location, onClear }: LocationInfoProps) {
  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-1 bg-orange-500 rounded-full">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Ubicación de la obra</p>
            <p className="text-xs text-gray-700 mt-1 break-words">
              {location.address || "Ubicación personalizada"}
            </p>
            <p className="text-xs text-orange-700 mt-1 font-mono">
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="ml-2 text-xs text-orange-600 hover:text-orange-800 underline flex-shrink-0"
        >
          Cambiar
        </button>
      </div>
    </div>
  );
}
