interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationSectionProps {
  getLocationForBooking: () => LocationData | null;
  onClearLocation?: () => void;
  showFullDetails?: boolean;
}

export default function LocationSection({
  getLocationForBooking,
  onClearLocation,
  showFullDetails = false
}: LocationSectionProps) {
  const location = getLocationForBooking();

  if (!location || (location.lat === 0 && location.lng === 0)) {
    return (
      <div className="py-4 flex items-center justify-between w-full border-b border-red-200 bg-red-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500 rounded-full">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.228 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">Ubicación requerida</p>
            <p className="text-xs text-red-600">
              Selecciona la ubicación de tu obra en el mapa para continuar
            </p>
          </div>
        </div>
        <div className="text-red-600">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 border-b border-green-200 bg-green-50">
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-green-500 rounded-full flex-shrink-0">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-800 mb-1">
              Ubicación de obra confirmada
            </p>

            <div className="space-y-1">
              <p className="text-sm text-green-700 break-words">
                <strong>Dirección:</strong> {location.address || "Ubicación personalizada"}
              </p>
              {showFullDetails && (
                <div className="mt-2 pt-2 border-t border-green-200">
                  <p className="text-xs text-green-600 italic">
                    Esta ubicación se usará para:
                  </p>
                  <ul className="text-xs text-green-600 mt-1 ml-4 space-y-0.5">
                    <li>• Calcular el costo exacto de flete</li>
                    <li>• Programar la entrega y recolección</li>
                    <li>• Coordinar la logística del transporte</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <div className="text-green-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          {onClearLocation && (
            <button
              onClick={onClearLocation}
              className="px-2 py-1 text-xs text-green-700 hover:text-green-900 hover:bg-green-100 border border-green-300 rounded transition-colors"
              title="Cambiar ubicación"
            >
              Cambiar
            </button>
          )}
        </div>
      </div>

      {!showFullDetails && (
        <div className="mt-2 text-xs text-green-600 italic">
          Ubicación lista para calcular costos de flete y programar entrega
        </div>
      )}
    </div>
  );
}
