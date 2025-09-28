"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

const normalizeLocation = (location: LocationData | null): { lat: number; lng: number } | null => {
  if (!location?.location) return null;

  const { latitude, longitude } = location.location;

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
      
      const apiToken = localStorage.getItem("api_access_token");
      
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
      
      const userLocation = data.locations.find(
        (loc: any) => loc.entity_id === userId
      );

      if (!userLocation) {
        const availableIds = data.locations.map((loc: any) => loc.entity_id);
        throw new Error(`Dispositivo "${userId}" no encontrado. Disponibles: ${availableIds.slice(0, 3).join(", ")}${availableIds.length > 3 ? '...' : ''}`);
      }

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

  useEffect(() => {
    if (!userId) {
      setError("No se proporcionó un ID de dispositivo");
      setLoading(false);
      return;
    }

    fetchDeviceLocation();
    
    const interval = setInterval(fetchDeviceLocation, 15000);
    
    return () => clearInterval(interval);
  }, [userId]);

  const getMapCenter = (): [number, number] => {
    const deviceCoords = normalizeLocation(deviceLocation);
    if (deviceCoords) {
      return [deviceCoords.lat, deviceCoords.lng];
    }
    
    return [23.6345, -102.5528];
  };

  const getLocationIcon = (location: LocationData) => {
    if (location.status === 'navigating') return navigatingIcon;
    if (location.entity_type === 'operador') return operatorIcon;
    if (location.entity_type === 'maquinaria') return maquinariaIcon;
    return deviceIcon;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="border-gray-300 h-8 w-8 animate-spin rounded-full border-4 border-t-blue-600 mb-3"></div>
        <p className="text-gray-500">Cargando mapa de seguimiento...</p>
        <p className="text-sm text-gray-500">Dispositivo: {userId}</p>
      </div>
    );
  }

  const deviceCoords = normalizeLocation(deviceLocation);
  const hasValidDevice = !!deviceCoords;

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 m-3 bg-white rounded shadow-sm p-3 z-50 min-w-80 max-w-96">
        <div className="flex justify-between items-center mb-2">
          <h6 className="mb-0 font-bold">Información de Seguimiento</h6>
          <small className="text-gray-500">
            Actualizado: {lastUpdate.toLocaleTimeString()}
          </small>
        </div>
        
        {deviceLocation && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">
                {deviceLocation.entity_type === 'operador' ? '🔧' : 
                 deviceLocation.entity_type === 'maquinaria' ? '🏗️' : '🚛'}
              </span>
              <strong>Dispositivo: {deviceLocation.entity_id}</strong>
              {deviceLocation.status && (
                <span className={`px-2 py-1 text-xs rounded ${
                  deviceLocation.status === 'navigating' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {deviceLocation.status}
                </span>
              )}
            </div>
            <small className="text-gray-500 block">
              Tipo: {deviceLocation.entity_type}
              <br />
              {hasValidDevice ? (
                <>Coordenadas: {deviceCoords!.lat.toFixed(6)}, {deviceCoords!.lng.toFixed(6)}</>
              ) : (
                <span className="text-red-500">Sin coordenadas GPS válidas</span>
              )}
              <br />
              Última actualización: {new Date(deviceLocation.timestamp).toLocaleString('es-ES')}
            </small>
          </div>
        )}

        {error && !hasValidDevice && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-0">
            <small><strong>Aviso:</strong> {error}</small>
          </div>
        )}
      </div>

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
          
          <Marker 
            position={[deviceCoords!.lat, deviceCoords!.lng]}
            icon={getLocationIcon(deviceLocation!)}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-blue-600">DISPOSITIVO</strong><br />
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
        <div className="h-full bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center text-gray-500 p-4">
            <div className="mb-3 text-5xl">📍</div>
            <h4 className="text-xl font-semibold mb-2">Sin ubicación disponible</h4>
            <p className="mb-3">No se pudieron obtener coordenadas GPS válidas para mostrar el mapa</p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-left mb-3">
                <small><strong>Error:</strong> {error}</small>
              </div>
            )}
            
            <button 
              onClick={() => {
                setLoading(true);
                fetchDeviceLocation();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Reintentando...
                </>
              ) : (
                "Reintentar"
              )}
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-0 right-0 m-3 z-40">
        <div className={`px-2 py-1 text-xs rounded text-white ${error ? 'bg-red-500' : 'bg-green-500'}`}>
          {error ? 'Error' : 'Conectado'}
        </div>
      </div>
    </div>
  );
}