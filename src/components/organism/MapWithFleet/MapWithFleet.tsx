"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createFleetIcon = (color: string, symbol: string, size: number = 35) => {
  return L.divIcon({
    className: 'custom-fleet-icon',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        position: relative;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: ${size * 0.45}px;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        ">${symbol}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const machineIcon = createFleetIcon('#e74c3c', '🚛');
const operatorIcon = createFleetIcon('#3498db', '👷');
const navigatingIcon = createFleetIcon('#f39c12', '🧭');
const availableIcon = createFleetIcon('#2ecc71', '✓');
const offlineIcon = createFleetIcon('#95a5a6', '⏸️');
const destinationIcon = createFleetIcon('#8e44ad', '🏗️');

interface LocationData {
  entity_id: string;
  entity_type: string;
  timestamp: string;
  status?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  latitude?: number;
  longitude?: number;
}

interface RouteData {
  machineId: string;
  coordinates: [number, number][];
  distance?: number;
  duration?: number;
  eta?: string;
}

interface DestinationData {
  latitude: number;
  longitude: number;
  address?: string;
  order_id?: string;
}

interface MapWithFleetProps {
  locations: LocationData[];
  zoom?: number;
  showFilters?: boolean;
  destination?: DestinationData | null;
  routes?: RouteData[];
  showDestination?: boolean;
  showRoutes?: boolean;
  clientMode?: boolean;
  title?: string;
}

const normalizeLocation = (location: LocationData): { lat: number; lng: number } | null => {
  let lat: number, lng: number;

  if (location.location) {
    lat = location.location.latitude;
    lng = location.location.longitude;
  } 
  else if (location.latitude !== undefined && location.longitude !== undefined) {
    lat = location.latitude;
    lng = location.longitude;
  } 
  else {
    return null;
  }

  if (typeof lat !== 'number' || typeof lng !== 'number' || 
      isNaN(lat) || isNaN(lng) ||
      (Math.abs(lat) < 0.001 && Math.abs(lng) < 0.001)) {
    return null;
  }

  return { lat, lng };
};

const getLocationIcon = (location: LocationData) => {
  if (location.entity_type === 'obra' || location.entity_type === 'destination') {
    return destinationIcon;
  }

  const status = location.status?.toLowerCase() || 'unknown';
  
  switch (status) {
    case 'navigating':
      return navigatingIcon;
    case 'available':
      return availableIcon;
    case 'offline':
      return offlineIcon;
    default:
      return location.entity_type === 'operador' ? operatorIcon : machineIcon;
  }
};

const getStatusColor = (status: string | undefined): string => {
  const statusLower = status?.toLowerCase() || 'unknown';
  
  switch (statusLower) {
    case 'navigating':
      return '#f39c12';
    case 'available':
      return '#2ecc71';
    case 'offline':
      return '#95a5a6';
    case 'destino':
      return '#8e44ad';
    default:
      return '#6c757d';
  }
};

export default function MapWithFleet({ 
  locations, 
  zoom = 6, 
  showFilters = true,
  destination = null,
  routes = [],
  showDestination = true,
  showRoutes = true,
  clientMode = false,
  title = "Estado de la Flota"
}: MapWithFleetProps) {
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>(locations);
  const [filters, setFilters] = useState({
    showMachines: true,
    showOperators: true,
    showNavigating: true,
    showAvailable: true,
    showOffline: true,
  });

  const initialPosition: [number, number] = [23.6345, -102.5528];

  const allLocations = [...locations];
  if (destination && showDestination) {
    allLocations.push({
      entity_id: 'destination',
      entity_type: 'obra',
      timestamp: new Date().toISOString(),
      status: 'destino',
      location: {
        latitude: destination.latitude,
        longitude: destination.longitude
      }
    });
  }

  const getMapCenter = (): [number, number] => {
    const validLocations = allLocations
      .map(normalizeLocation)
      .filter(Boolean) as { lat: number; lng: number }[];

    if (validLocations.length === 0) {
      return initialPosition;
    }

    const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
    const avgLng = validLocations.reduce((sum, loc) => sum + loc.lng, 0) / validLocations.length;

    return [avgLat, avgLng];
  };

  useEffect(() => {
    const filtered = allLocations.filter(location => {
      const status = location.status?.toLowerCase() || 'unknown';
      const entityType = location.entity_type?.toLowerCase() || 'unknown';

      if (entityType === 'obra' || entityType === 'destination') return true;

      if (entityType.includes('operador') && !filters.showOperators) return false;
      if (entityType.includes('maquinaria') && !filters.showMachines) return false;

      if (status === 'navigating' && !filters.showNavigating) return false;
      if (status === 'available' && !filters.showAvailable) return false;
      if (status === 'offline' && !filters.showOffline) return false;

      return true;
    });

    setFilteredLocations(filtered);
  }, [allLocations, filters]);

  const getFleetStats = () => {
    const stats = {
      total: locations.length,
      machines: 0,
      operators: 0,
      navigating: 0,
      available: 0,
      offline: 0,
      withValidGPS: 0,
    };

    locations.forEach(location => {
      const entityType = location.entity_type?.toLowerCase() || '';
      const status = location.status?.toLowerCase() || 'unknown';
      
      if (entityType.includes('maquinaria')) stats.machines++;
      if (entityType.includes('operador')) stats.operators++;
      
      if (status === 'navigating') stats.navigating++;
      else if (status === 'available') stats.available++;
      else if (status === 'offline') stats.offline++;
      
      if (normalizeLocation(location)) stats.withValidGPS++;
    });

    return stats;
  };

  const fleetStats = getFleetStats();
  const validLocations = filteredLocations
    .map(location => ({ location, coords: normalizeLocation(location) }))
    .filter(item => item.coords !== null);

  const getOptimalZoom = (): number => {
    if (validLocations.length <= 1) return zoom;
    
    const lats = validLocations.map(item => item.coords!.lat);
    const lngs = validLocations.map(item => item.coords!.lng);
    
    const latRange = Math.max(...lats) - Math.min(...lats);
    const lngRange = Math.max(...lngs) - Math.min(...lngs);
    const maxRange = Math.max(latRange, lngRange);
    
    if (maxRange > 1) return 8;
    if (maxRange > 0.1) return 11;
    if (maxRange > 0.01) return 13;
    return 15;
  };

  if (locations.length === 0 && !destination) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-center">
          <div className="mb-3 text-5xl">🚛</div>
          <h4 className="text-xl font-semibold mb-2">No hay dispositivos para mostrar</h4>
          <p className="text-gray-500">
            {clientMode ? 
              "No se encontraron dispositivos asignados a esta orden" :
              "No se encontraron maquinarias u operadores para mostrar"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 m-3 bg-white rounded shadow p-3 z-50 min-w-70">
        <h6 className="font-bold mb-3">{title}</h6>
        
        {clientMode ? (
          <div>
            {destination && (
              <div className="mb-3">
                <h6 className="text-sm font-bold mb-2">Destino:</h6>
                <p className="text-sm text-gray-500 mb-1">
                  {destination.address || "Ubicación de la obra"}
                </p>
                <p className="text-sm text-gray-500">
                  {destination.latitude.toFixed(6)}, {destination.longitude.toFixed(6)}
                </p>
              </div>
            )}
            
            <div className="mb-3">
              <div className="flex justify-between">
                <span className="text-sm">Dispositivos activos:</span>
                <strong>{fleetStats.withValidGPS}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">En navegación:</span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">{fleetStats.navigating}</span>
              </div>
            </div>

            {routes.length > 0 && (
              <div className="mb-3">
                <h6 className="text-sm font-bold mb-2">ETA Estimado:</h6>
                {routes.map(route => (
                  <div key={route.machineId} className="text-sm">
                    <strong>{route.machineId}:</strong> {route.eta || "Calculando..."}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center p-2 bg-gray-100 rounded">
                <div className="font-bold text-blue-600">{fleetStats.total}</div>
                <small className="text-gray-500">Total dispositivos</small>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded">
                <div className="font-bold text-green-600">{fleetStats.withValidGPS}</div>
                <small className="text-gray-500">Con GPS válido</small>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between">
                <span className="text-sm">🚛 Maquinarias:</span>
                <strong>{fleetStats.machines}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">👷 Operadores:</span>
                <strong>{fleetStats.operators}</strong>
              </div>
            </div>

            <div className="mb-3">
              <h6 className="text-sm font-bold">Estados:</h6>
              <div className="flex justify-between">
                <span className="text-sm">🧭 Navegando:</span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">{fleetStats.navigating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">✓ Disponible:</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">{fleetStats.available}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">⏸️ Desconectado:</span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">{fleetStats.offline}</span>
              </div>
            </div>

            {showFilters && (
              <div>
                <h6 className="text-sm font-bold mb-2">Filtros:</h6>
                <div className="flex flex-wrap gap-1">
                  <div className="flex items-center">
                    <input
                      className="mr-1"
                      type="checkbox"
                      id="showMachines"
                      checked={filters.showMachines}
                      onChange={(e) => setFilters(prev => ({ ...prev, showMachines: e.target.checked }))}
                    />
                    <label className="text-sm" htmlFor="showMachines">🚛</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      className="mr-1"
                      type="checkbox"
                      id="showOperators"
                      checked={filters.showOperators}
                      onChange={(e) => setFilters(prev => ({ ...prev, showOperators: e.target.checked }))}
                    />
                    <label className="text-sm" htmlFor="showOperators">👷</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      className="mr-1"
                      type="checkbox"
                      id="showNavigating"
                      checked={filters.showNavigating}
                      onChange={(e) => setFilters(prev => ({ ...prev, showNavigating: e.target.checked }))}
                    />
                    <label className="text-sm" htmlFor="showNavigating">🧭</label>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ height: "600px", width: "100%" }} className="rounded-lg overflow-hidden">
        {validLocations.length > 0 ? (
          <MapContainer
            center={getMapCenter()}
            zoom={getOptimalZoom()}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
            key={`map-${validLocations.length}-${destination?.latitude}`}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            />

            {validLocations.map(({ location, coords }, index) => (
              <Marker
                key={`${location.entity_id}-${index}`}
                position={[coords!.lat, coords!.lng]}
                icon={getLocationIcon(location)}
              >
                <Popup>
                  <div className="text-center">
                    <strong style={{ color: getStatusColor(location.status) }}>
                      {location.entity_type === 'obra' ? 'DESTINO' : 
                       location.entity_type?.toUpperCase() || 'DISPOSITIVO'}
                    </strong>
                    <br />
                    <strong>ID:</strong> {location.entity_id}
                    <br />
                    {location.status && location.entity_type !== 'obra' && (
                      <>
                        <strong>Estado:</strong> 
                        <span 
                          className="px-2 py-1 text-xs rounded ml-1" 
                          style={{ backgroundColor: getStatusColor(location.status) }}
                        >
                          {location.status}
                        </span>
                        <br />
                      </>
                    )}
                    <strong>Coordenadas:</strong> {coords!.lat.toFixed(6)}, {coords!.lng.toFixed(6)}
                    <br />
                    {location.entity_type !== 'obra' && (
                      <>
                        <strong>Actualizado:</strong> {new Date(location.timestamp).toLocaleString('es-ES')}
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            {showRoutes && routes.map((route, index) => (
              <Polyline
                key={`route-${route.machineId}-${index}`}
                positions={route.coordinates}
                color="#e74c3c"
                weight={4}
                opacity={0.7}
                dashArray="10, 10"
              />
            ))}
          </MapContainer>
        ) : (
          <div className="h-full bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="mb-3 text-5xl">🗺️</div>
              <h4 className="text-xl font-semibold mb-2">No hay ubicaciones para mostrar</h4>
              <p>
                {clientMode ? 
                  "Verifica que los dispositivos estén enviando su ubicación" :
                  "Ajusta los filtros o verifica que los dispositivos tengan GPS válido"
                }
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 right-0 m-3">
        <div className="bg-white rounded shadow p-2 flex items-center gap-2">
          <div className="bg-green-500 rounded-full w-2 h-2"></div>
          <small className="text-gray-500">
            {clientMode ? "Actualizando cada 15s" : "Actualizando cada 10s"}
          </small>
        </div>
      </div>
    </div>
  );
}