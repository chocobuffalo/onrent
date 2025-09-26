// src/components/organism/MapWithFleet/MapWithFleet.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Crear iconos personalizados por tipo de dispositivo y estado
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
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        ">${symbol}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Iconos diferenciados
const machineIcon = createFleetIcon('#e74c3c', '🚛');
const operatorIcon = createFleetIcon('#3498db', '👷');
const navigatingIcon = createFleetIcon('#f39c12', '🧭');
const availableIcon = createFleetIcon('#2ecc71', '✓');
const offlineIcon = createFleetIcon('#95a5a6', '⏸️');

// Interfaces para los datos de ubicación
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

interface MapWithFleetProps {
  locations: LocationData[];
  zoom?: number;
  showFilters?: boolean;
}

// Helper para normalizar coordenadas
const normalizeLocation = (location: LocationData): { lat: number; lng: number } | null => {
  let lat: number, lng: number;

  // Verificar estructura anidada
  if (location.location) {
    lat = location.location.latitude;
    lng = location.location.longitude;
  } 
  // Verificar estructura plana
  else if (location.latitude !== undefined && location.longitude !== undefined) {
    lat = location.latitude;
    lng = location.longitude;
  } 
  else {
    return null;
  }

  // Validar números válidos
  if (typeof lat !== 'number' || typeof lng !== 'number' || 
      isNaN(lat) || isNaN(lng) ||
      (Math.abs(lat) < 0.001 && Math.abs(lng) < 0.001)) {
    return null;
  }

  return { lat, lng };
};

// Función para obtener el icono apropiado
const getLocationIcon = (location: LocationData) => {
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

// Función para obtener el color del estado
const getStatusColor = (status: string | undefined): string => {
  const statusLower = status?.toLowerCase() || 'unknown';
  
  switch (statusLower) {
    case 'navigating':
      return '#f39c12';
    case 'available':
      return '#2ecc71';
    case 'offline':
      return '#95a5a6';
    default:
      return '#6c757d';
  }
};

export default function MapWithFleet({ 
  locations, 
  zoom = 6, 
  showFilters = true 
}: MapWithFleetProps) {
  const [filteredLocations, setFilteredLocations] = useState<LocationData[]>(locations);
  const [filters, setFilters] = useState({
    showMachines: true,
    showOperators: true,
    showNavigating: true,
    showAvailable: true,
    showOffline: true,
  });

  // Posición inicial centrada en México
  const initialPosition: [number, number] = [23.6345, -102.5528];

  // Calcular centro del mapa basado en ubicaciones válidas
  const getMapCenter = (): [number, number] => {
    const validLocations = locations
      .map(normalizeLocation)
      .filter(Boolean) as { lat: number; lng: number }[];

    if (validLocations.length === 0) {
      return initialPosition;
    }

    // Calcular promedio de coordenadas
    const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
    const avgLng = validLocations.reduce((sum, loc) => sum + loc.lng, 0) / validLocations.length;

    return [avgLat, avgLng];
  };

  // Aplicar filtros
  useEffect(() => {
    const filtered = locations.filter(location => {
      const status = location.status?.toLowerCase() || 'unknown';
      const entityType = location.entity_type?.toLowerCase() || 'unknown';

      // Filtrar por tipo de entidad
      if (entityType.includes('operador') && !filters.showOperators) return false;
      if (entityType.includes('maquinaria') && !filters.showMachines) return false;

      // Filtrar por estado
      if (status === 'navigating' && !filters.showNavigating) return false;
      if (status === 'available' && !filters.showAvailable) return false;
      if (status === 'offline' && !filters.showOffline) return false;

      return true;
    });

    setFilteredLocations(filtered);
  }, [locations, filters]);

  // Obtener estadísticas de la flota
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

  if (locations.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "600px" }}>
        <div className="text-center">
          <div className="mb-3" style={{ fontSize: "48px" }}>🚛</div>
          <h4>No hay dispositivos en la flota</h4>
          <p className="text-muted">No se encontraron maquinarias u operadores para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 h-100 position-relative">
      {/* Panel de estadísticas */}
      <div className="position-absolute top-0 start-0 m-3 bg-white rounded shadow p-3" style={{ zIndex: 1000, minWidth: "280px" }}>
        <h6 className="fw-bold mb-3">Estado de la Flota</h6>
        
        {/* Estadísticas generales */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="text-center p-2 bg-light rounded">
              <div className="fw-bold text-primary">{fleetStats.total}</div>
              <small className="text-muted">Total dispositivos</small>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center p-2 bg-light rounded">
              <div className="fw-bold text-success">{fleetStats.withValidGPS}</div>
              <small className="text-muted">Con GPS válido</small>
            </div>
          </div>
        </div>

        {/* Estadísticas por tipo */}
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <span className="small">🚛 Maquinarias:</span>
            <strong>{fleetStats.machines}</strong>
          </div>
          <div className="d-flex justify-content-between">
            <span className="small">👷 Operadores:</span>
            <strong>{fleetStats.operators}</strong>
          </div>
        </div>

        {/* Estados activos */}
        <div className="mb-3">
          <h6 className="small fw-bold">Estados:</h6>
          <div className="d-flex justify-content-between">
            <span className="small">🧭 Navegando:</span>
            <span className="badge bg-warning">{fleetStats.navigating}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="small">✓ Disponible:</span>
            <span className="badge bg-success">{fleetStats.available}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="small">⏸️ Desconectado:</span>
            <span className="badge bg-secondary">{fleetStats.offline}</span>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div>
            <h6 className="small fw-bold mb-2">Filtros:</h6>
            <div className="d-flex flex-wrap gap-1">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showMachines"
                  checked={filters.showMachines}
                  onChange={(e) => setFilters(prev => ({ ...prev, showMachines: e.target.checked }))}
                />
                <label className="form-check-label small" htmlFor="showMachines">🚛</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showOperators"
                  checked={filters.showOperators}
                  onChange={(e) => setFilters(prev => ({ ...prev, showOperators: e.target.checked }))}
                />
                <label className="form-check-label small" htmlFor="showOperators">👷</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showNavigating"
                  checked={filters.showNavigating}
                  onChange={(e) => setFilters(prev => ({ ...prev, showNavigating: e.target.checked }))}
                />
                <label className="form-check-label small" htmlFor="showNavigating">🧭</label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mapa principal */}
      <div style={{ height: "600px", width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}>
        {validLocations.length > 0 ? (
          <MapContainer
            center={getMapCenter()}
            zoom={zoom}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
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
                      {location.entity_type?.toUpperCase() || 'DISPOSITIVO'}
                    </strong>
                    <br />
                    <strong>ID:</strong> {location.entity_id}
                    <br />
                    {location.status && (
                      <>
                        <strong>Estado:</strong> 
                        <span 
                          className="badge ms-1" 
                          style={{ backgroundColor: getStatusColor(location.status) }}
                        >
                          {location.status}
                        </span>
                        <br />
                      </>
                    )}
                    <strong>Coordenadas:</strong> {coords!.lat.toFixed(6)}, {coords!.lng.toFixed(6)}
                    <br />
                    <strong>Actualizado:</strong> {new Date(location.timestamp).toLocaleString('es-ES')}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="h-100 bg-light rounded d-flex align-items-center justify-content-center">
            <div className="text-center text-muted">
              <div className="mb-3" style={{ fontSize: "48px" }}>🗺️</div>
              <h4>No hay ubicaciones para mostrar</h4>
              <p>Ajusta los filtros o verifica que los dispositivos tengan GPS válido</p>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de actualización en tiempo real */}
      <div className="position-absolute bottom-0 end-0 m-3">
        <div className="bg-white rounded shadow p-2 d-flex align-items-center gap-2">
          <div className="bg-success rounded-circle" style={{ width: "8px", height: "8px" }}></div>
          <small className="text-muted">Actualizando cada 10s</small>
        </div>
      </div>
    </div>
  );
}