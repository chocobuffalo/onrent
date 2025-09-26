// src/components/organism/AmazonLocationService/VehicleMap.tsx
"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icons para Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Crear iconos personalizados mejorados
const createCustomIcon = (color: string, symbol: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 35px;
        height: 35px;
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
          font-size: 18px;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
        ">${symbol}</span>
      </div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  });
};

// Iconos diferenciados por tipo y estado
const deviceIcon = createCustomIcon('#e74c3c', '🚛');
const operatorIcon = createCustomIcon('#3498db', '🔧');
const navigatingIcon = createCustomIcon('#f39c12', '🧭');
const maquinariaIcon = createCustomIcon('#9b59b6', '🏗️');

interface LocationData {
  entity_id: string;
  entity_type: string;
  timestamp: string;
  status?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface VehicleMapProps {
  userId: string;
}

// Helper para normalizar coordenadas
const normalizeLocation = (location: LocationData | null): { lat: number; lng: number } | null => {
  if (!location?.location) return null;

  const { latitude, longitude } = location.location;

  // Validar que sean números válidos
  if (typeof latitude !== 'number' || typeof longitude !== 'number' || 
      isNaN(latitude) || isNaN(longitude) ||
      (Math.abs(latitude) < 0.001 && Math.abs(longitude) < 0.001)) {
    return null;
  }

  return { lat: latitude, lng: longitude };
};

export default function VehicleMap({ userId }: VehicleMapProps) {
  const [deviceLocation, setDeviceLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchDeviceLocation = async () => {
    try {
      setError(null);
      
      console.log(`🔍 [${new Date().toLocaleTimeString()}] Buscando ubicación para deviceId:`, userId);
      
      // Obtener token de autenticación
      const apiToken = localStorage.getItem("api_access_token");
      
      // Usar el endpoint que funciona y filtrar por ID
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/location/sync/list`;
      console.log("🌐 Consultando API:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(apiToken && { 'Authorization': `Bearer ${apiToken}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📡 Respuesta de API:", { count: data.count, totalLocations: data.locations?.length });

      if (!data.locations || !Array.isArray(data.locations)) {
        throw new Error("Formato de respuesta inválido de la API");
      }

      setLastUpdate(new Date());
      
      // Buscar la ubicación específica del dispositivo en la lista
      const userLocation = data.locations.find(
        (loc: any) => loc.entity_id === userId
      );

      if (!userLocation) {
        const availableIds = data.locations.map((loc: any) => loc.entity_id);
        throw new Error(`Dispositivo "${userId}" no encontrado. Disponibles: ${availableIds.slice(0, 3).join(", ")}${availableIds.length > 3 ? '...' : ''}`);
      }

      // Convertir al formato esperado
      const locationData: LocationData = {
        entity_id: userLocation.entity_id,
        entity_type: userLocation.entity_type || 'maquinaria',
        timestamp: userLocation.timestamp,
        status: userLocation.status || 'active',
        location: {
          latitude: userLocation.location?.latitude || userLocation.latitude || 0,
          longitude: userLocation.location?.longitude || userLocation.longitude || 0
        }
      };

      const normalizedLocation = normalizeLocation(locationData);
      
      if (!normalizedLocation) {
        throw new Error(`El dispositivo "${userId}" no tiene coordenadas GPS válidas`);
      }

      console.log("✅ Ubicación válida encontrada:", {
        id: locationData.entity_id,
        coordinates: normalizedLocation,
        status: locationData.status
      });

      setDeviceLocation(locationData);

    } catch (error) {
      console.error("❌ Error al obtener ubicación:", error);
      const errorMessage = error instanceof Error ? error.message : "Error de conexión desconocido";
      setError(errorMessage);
      setDeviceLocation(null);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos inicial y configurar actualización automática
  useEffect(() => {
    if (!userId) {
      setError("No se proporcionó un ID de dispositivo");
      setLoading(false);
      return;
    }

    // Carga inicial
    fetchDeviceLocation();
    
    // Actualización automática cada 15 segundos
    const interval = setInterval(fetchDeviceLocation, 15000);
    
    return () => clearInterval(interval);
  }, [userId]);

  // Función para calcular el centro del mapa
  const getMapCenter = (): [number, number] => {
    const deviceCoords = normalizeLocation(deviceLocation);
    if (deviceCoords) {
      return [deviceCoords.lat, deviceCoords.lng];
    }
    
    // Fallback: México central
    return [23.6345, -102.5528];
  };

  // Función para seleccionar icono según tipo y estado
  const getLocationIcon = (location: LocationData) => {
    if (location.status === 'navigating') return navigatingIcon;
    if (location.entity_type === 'operador') return operatorIcon;
    if (location.entity_type === 'maquinaria') return maquinariaIcon;
    return deviceIcon;
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted">Cargando mapa de seguimiento...</p>
        <p className="small text-muted">Dispositivo: {userId}</p>
      </div>
    );
  }

  // Obtener coordenadas normalizadas
  const deviceCoords = normalizeLocation(deviceLocation);
  const hasValidDevice = !!deviceCoords;

  return (
    <div className="w-100 h-100 position-relative">
      {/* Panel de información superior */}
      <div className="position-absolute top-0 start-0 m-3 bg-white rounded shadow-sm p-3" style={{ zIndex: 1000, minWidth: "320px", maxWidth: "400px" }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0 fw-bold">Información de Seguimiento</h6>
          <small className="text-muted">
            Actualizado: {lastUpdate.toLocaleTimeString()}
          </small>
        </div>
        
        {deviceLocation && (
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span style={{ fontSize: "18px" }}>
                {deviceLocation.entity_type === 'operador' ? '🔧' : 
                 deviceLocation.entity_type === 'maquinaria' ? '🏗️' : '🚛'}
              </span>
              <strong>Dispositivo: {deviceLocation.entity_id}</strong>
              {deviceLocation.status && (
                <span className={`badge ${deviceLocation.status === 'navigating' ? 'bg-warning' : 'bg-success'}`}>
                  {deviceLocation.status}
                </span>
              )}
            </div>
            <small className="text-muted d-block">
              Tipo: {deviceLocation.entity_type}
              <br />
              {hasValidDevice ? (
                <>Coordenadas: {deviceCoords!.lat.toFixed(6)}, {deviceCoords!.lng.toFixed(6)}</>
              ) : (
                <span className="text-danger">Sin coordenadas GPS válidas</span>
              )}
              <br />
              Última actualización: {new Date(deviceLocation.timestamp).toLocaleString('es-ES')}
            </small>
          </div>
        )}

        {error && !hasValidDevice && (
          <div className="alert alert-warning py-2 mb-0">
            <small><strong>Aviso:</strong> {error}</small>
          </div>
        )}
      </div>

      {/* Mapa principal */}
      {hasValidDevice ? (
        <MapContainer
          center={getMapCenter()}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          className="rounded shadow-sm"
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Marcador del dispositivo */}
          <Marker 
            position={[deviceCoords!.lat, deviceCoords!.lng]}
            icon={getLocationIcon(deviceLocation!)}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-primary">DISPOSITIVO</strong><br />
                <strong>ID:</strong> {deviceLocation!.entity_id}<br />
                <strong>Tipo:</strong> {deviceLocation!.entity_type}<br />
                {deviceLocation!.status && <><strong>Estado:</strong> {deviceLocation!.status}<br /></>}
                <strong>Coordenadas:</strong> {deviceCoords!.lat.toFixed(6)}, {deviceCoords!.lng.toFixed(6)}<br />
                <strong>Actualizado:</strong> {new Date(deviceLocation!.timestamp).toLocaleString('es-ES')}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        // Estado sin ubicaciones válidas
        <div className="h-100 bg-light rounded border-2 border-dashed d-flex align-items-center justify-content-center">
          <div className="text-center text-muted p-4">
            <div className="mb-3" style={{ fontSize: "48px" }}>📍</div>
            <h4>Sin ubicación disponible</h4>
            <p className="mb-3">No se pudieron obtener coordenadas GPS válidas para mostrar el mapa</p>
            
            {error && (
              <div className="alert alert-danger text-start">
                <small><strong>Error:</strong> {error}</small>
              </div>
            )}
            
            <button 
              onClick={() => {
                setLoading(true);
                fetchDeviceLocation();
              }}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </span>
                  Reintentando...
                </>
              ) : (
                "Reintentar"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Indicador de estado de conexión */}
      <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 999 }}>
        <div className={`badge ${error ? 'bg-danger' : 'bg-success'}`}>
          {error ? 'Error' : 'Conectado'}
        </div>
      </div>
    </div>
  );
}