// src/components/organism/OperatorMap/OperatorMap.tsx
"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

interface LatLng {
  lat: number;
  lng: number;
}

interface OperatorMapProps {
  currentLocation: LatLng | null;
  destination: LatLng | null;
  destinationAddress: string;
  route: LatLng[];
  isNavigating: boolean;
  routeDistance?: number | null;
  estimatedDuration?: number | null;
}

// Fix iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Crear iconos personalizados
const createCustomIcon = (color: string, symbol: string, size: number = 40) => {
  return L.divIcon({
    className: 'custom-operator-icon',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        border: 4px solid white;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        position: relative;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: ${size * 0.5}px;
          font-weight: bold;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        ">${symbol}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Iconos específicos para navegación
const operatorIcon = createCustomIcon('#2ecc71', '🚗', 45);
const operatorNavigatingIcon = createCustomIcon('#f39c12', '🧭', 45);
const destinationIcon = createCustomIcon('#e74c3c', '🏁', 40);

// Componente para centrar el mapa automáticamente
const MapCenterUpdater = ({ center }: { center: LatLng | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map && center) {
      map.whenReady(() => {
        const currentZoom = map.getZoom();
        map.setView([center.lat, center.lng], currentZoom);
      });
    }
  }, [center, map]);
  
  return null;
};

// Componente para ajustar vista a la ruta completa
const RouteFitBounds = ({ route, currentLocation, destination }: { 
  route: LatLng[], 
  currentLocation: LatLng | null,
  destination: LatLng | null 
}) => {
  const map = useMap();

  useEffect(() => {
    if (map && route.length > 0) {
      const bounds = L.latLngBounds([]);
      
      // Agregar puntos de la ruta a los límites
      route.forEach(point => bounds.extend([point.lat, point.lng]));
      
      // Agregar ubicación actual y destino si están disponibles
      if (currentLocation) bounds.extend([currentLocation.lat, currentLocation.lng]);
      if (destination) bounds.extend([destination.lat, destination.lng]);
      
      // Ajustar vista con padding
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, route, currentLocation, destination]);

  return null;
};

const OperatorMap = ({
  currentLocation,
  destination,
  destinationAddress,
  route,
  isNavigating,
  routeDistance,
  estimatedDuration,
}: OperatorMapProps) => {
  const initialPosition: LatLng = { lat: 23.6345, lng: -102.5528 };

  // Formatear duración estimada
  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "Calculando...";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  // Formatear distancia
  const formatDistance = (meters: number | null): string => {
    if (!meters) return "Calculando...";
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  if (!currentLocation) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-light rounded">
        <div className="text-center p-4">
          <div className="mb-3" style={{ fontSize: "48px" }}>📍</div>
          <h4>Esperando ubicación GPS</h4>
          <p className="text-muted">
            Asegúrate de permitir el acceso a tu ubicación en el navegador
          </p>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Obteniendo ubicación...</span>
          </div>
        </div>
      </div>
    );
  }

  const routePositions: [number, number][] = route.map((step) => [
    step.lat,
    step.lng,
  ]);

  return (
    <div className="w-100 h-100 position-relative">
      {/* Panel de información de navegación */}
      {(destination || isNavigating) && (
        <div className="position-absolute top-0 start-0 m-3 bg-white rounded shadow p-3" style={{ zIndex: 1000, minWidth: "300px" }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0 fw-bold">
              {isNavigating ? (
                <>
                  <span className="text-warning me-2">🧭</span>
                  Navegando
                </>
              ) : (
                <>
                  <span className="text-info me-2">🗺️</span>
                  Ruta planificada
                </>
              )}
            </h6>
            {isNavigating && (
              <span className="badge bg-warning">
                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                En vivo
              </span>
            )}
          </div>
          
          {destination && (
            <div className="mb-2">
              <strong>Destino:</strong>
              <br />
              <small className="text-muted">{destinationAddress}</small>
            </div>
          )}
          
          <div className="row g-2">
            <div className="col-6">
              <div className="text-center p-2 bg-light rounded">
                <div className="fw-bold text-primary">{formatDistance(routeDistance ?? null)}</div>
                <small className="text-muted">Distancia</small>
              </div>
            </div>
            <div className="col-6">
              <div className="text-center p-2 bg-light rounded">
                <div className="fw-bold text-success">{formatDuration(estimatedDuration ?? null)}</div>
                <small className="text-muted">Tiempo estimado</small>
              </div>
            </div>
          </div>
          
          {isNavigating && (
            <div className="mt-2">
              <small className="text-warning">
                <strong>📡 Compartiendo ubicación en tiempo real</strong>
              </small>
            </div>
          )}
        </div>
      )}

      {/* Mapa principal */}
      <div style={{ height: "100%", width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}>
        <MapContainer
          center={[currentLocation.lat, currentLocation.lng]}
          zoom={13}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />
          
          {/* Marcador de ubicación actual del operador */}
          <Marker 
            position={[currentLocation.lat, currentLocation.lng]}
            icon={isNavigating ? operatorNavigatingIcon : operatorIcon}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-success">
                  {isNavigating ? "🧭 NAVEGANDO" : "📍 TU UBICACIÓN"}
                </strong>
                <br />
                <strong>Coordenadas:</strong> {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                <br />
                <strong>Estado:</strong> {isNavigating ? "Navegando hacia destino" : "Estacionario"}
                <br />
                <small className="text-muted">
                  Actualizado: {new Date().toLocaleTimeString('es-ES')}
                </small>
              </div>
            </Popup>
          </Marker>

          {/* Marcador de destino */}
          {destination && (
            <Marker 
              position={[destination.lat, destination.lng]}
              icon={destinationIcon}
            >
              <Popup>
                <div className="text-center">
                  <strong className="text-danger">🏁 DESTINO</strong>
                  <br />
                  <strong>Dirección:</strong> {destinationAddress}
                  <br />
                  <strong>Coordenadas:</strong> {destination.lat.toFixed(6)}, {destination.lng.toFixed(6)}
                  {routeDistance && (
                    <>
                      <br />
                      <strong>Distancia:</strong> {formatDistance(routeDistance)}
                    </>
                  )}
                  {estimatedDuration && (
                    <>
                      <br />
                      <strong>Tiempo estimado:</strong> {formatDuration(estimatedDuration)}
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Ruta calculada */}
          {routePositions.length > 0 && (
            <Polyline 
              positions={routePositions} 
              color={isNavigating ? "#f39c12" : "#3498db"}
              weight={5}
              opacity={0.8}
              dashArray={isNavigating ? undefined : "10, 5"}
            />
          )}

          {/* Actualizar centro del mapa */}
          <MapCenterUpdater
            center={
              isNavigating ? currentLocation : 
              (destination || currentLocation)
            }
          />

          {/* Ajustar vista para mostrar toda la ruta */}
          {routePositions.length > 0 && !isNavigating && (
            <RouteFitBounds 
              route={route}
              currentLocation={currentLocation}
              destination={destination}
            />
          )}
        </MapContainer>
      </div>

      {/* Indicador de estado GPS */}
      <div className="position-absolute bottom-0 start-0 m-3">
        <div className="bg-white rounded shadow p-2 d-flex align-items-center gap-2">
          <div className="bg-success rounded-circle" style={{ width: "8px", height: "8px" }}></div>
          <small className="text-muted">GPS Activo</small>
        </div>
      </div>

      {/* Panel de controles rápidos */}
      <div className="position-absolute bottom-0 end-0 m-3">
        <div className="btn-group-vertical">
          <button 
            className="btn btn-light btn-sm shadow"
            onClick={() => {
              // Lógica para centrar en ubicación actual
              const map = (window as any).operatorMap;
              if (map && currentLocation) {
                map.setView([currentLocation.lat, currentLocation.lng], 15);
              }
            }}
            title="Centrar en mi ubicación"
          >
            📍
          </button>
          {destination && (
            <button 
              className="btn btn-light btn-sm shadow"
              onClick={() => {
                // Lógica para mostrar ruta completa
                const map = (window as any).operatorMap;
                if (map && routePositions.length > 0) {
                  const bounds = L.latLngBounds(routePositions);
                  map.fitBounds(bounds, { padding: [20, 20] });
                }
              }}
              title="Ver ruta completa"
            >
              🗺️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorMap;