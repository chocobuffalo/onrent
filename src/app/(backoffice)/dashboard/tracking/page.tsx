"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import VehicleMap from "@/components/organism/AmazonLocationService/VehicleMap";
import { getAvailableDevices } from "@/services/locationService";

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
  name?: string;
  brand?: string;
  model?: string;
  machine_type?: string;
  daily_rate?: number;
  provider_id?: string;
  certified?: boolean;
}

const TrackingPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const deviceId = searchParams.get("deviceId");
  
  const [userData, setUserData] = useState<any>(null);
  const [availableDevices, setAvailableDevices] = useState<LocationData[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const initialTrackingId = orderId || deviceId;

  useEffect(() => {
    const apiUserData = localStorage.getItem("api_user_data");
    const apiToken = localStorage.getItem("api_access_token");
    if (apiUserData) {
      try {
        const parsedUserData = JSON.parse(apiUserData);
        console.log("Usuario parseado:", parsedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parseando datos de usuario:", error);
      }
    }

    if (initialTrackingId) {
      setSelectedDeviceId(initialTrackingId);
    }
  }, [initialTrackingId, session, status]);

  useEffect(() => {
    const fetchAvailableDevices = async () => {
      try {
        setIsLoading(true);
        
        const nextAuthToken = (session as any)?.accessToken || (session as any)?.user?.accessToken;
        const localStorageToken = localStorage.getItem("api_access_token");
        const token = nextAuthToken || localStorageToken;
        const data = await getAvailableDevices(token)
        
        const allDevices = data.locations || [];
        
        let filteredDevices = allDevices;
        
        if (userData) {
          const userRole = userData.role;
          const userEntityId = userData.entity_id || userData.user_id;
          if (userRole === 'provider') {
            filteredDevices = allDevices.filter((device: LocationData) => {
              if (device.entity_id === userEntityId && device.entity_type === 'provider') {
                return true;
              }
              
              if (device.entity_type === 'maquinaria') {
                const lat: number = device.location?.latitude ?? device.latitude ?? 0;
                const lng: number = device.location?.longitude ?? device.longitude ?? 0;
                return Math.abs(lat) > 0.001 || Math.abs(lng) > 0.001;
              }
              
              return false;
            });
          } else if (userRole === 'client') {
            filteredDevices = allDevices.filter((device: LocationData) => {
              if (device.entity_type === 'maquinaria') {
                const lat: number = device.location?.latitude ?? device.latitude ?? 0;
                const lng: number = device.location?.longitude ?? device.longitude ?? 0;
                return Math.abs(lat) > 0.001 || Math.abs(lng) > 0.001;
              }
              return false;
            });
          } else {
            filteredDevices = allDevices.filter((device: LocationData) => {
              const lat: number = device.location?.latitude ?? device.latitude ?? 0;
              const lng: number = device.location?.longitude ?? device.longitude ?? 0;
              return Math.abs(lat) > 0.001 || Math.abs(lng) > 0.001;
            });
          }
        } else {
          filteredDevices = allDevices.filter((device: LocationData) => {
            const lat: number = device.location?.latitude ?? device.latitude ?? 0;
            const lng: number = device.location?.longitude ?? device.longitude ?? 0;
            return Math.abs(lat) > 0.001 || Math.abs(lng) > 0.001;
          });
        }
        
        console.log("Dispositivos filtrados:", filteredDevices.length, "de", allDevices.length);
        setAvailableDevices(filteredDevices);
        
        if (!initialTrackingId && filteredDevices.length > 0) {
          const firstDevice = filteredDevices[0];
          setSelectedDeviceId(firstDevice.entity_id);
        }
      } catch (error) {
        console.error("Error loading available devices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableDevices();
  }, [initialTrackingId, userData, session]);

  const handleDeviceChange = (newDeviceId: string) => {
    setSelectedDeviceId(newDeviceId);
    
    const url = new URL(window.location.href);
    if (newDeviceId) {
      if (orderId) {
        url.searchParams.set('orderId', newDeviceId);
      } else {
        url.searchParams.set('deviceId', newDeviceId);
      }
    } else {
      url.searchParams.delete('orderId');
      url.searchParams.delete('deviceId');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const devicesWithGPS = availableDevices.filter(device => {
    const hasLocation = device.location || (device.latitude !== undefined && device.longitude !== undefined);
    if (!hasLocation) return false;
    
    const lat = device.location?.latitude ?? device.latitude ?? 0;
    const lng = device.location?.longitude ?? device.longitude ?? 0;
    
    return Math.abs(lat) > 0.001 || Math.abs(lng) > 0.001;
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cargando dispositivos disponibles...
          </h3>
          <p className="text-gray-600">
            {initialTrackingId ? `Buscando ${orderId ? 'orden' : 'dispositivo'}: ${initialTrackingId}` : "Obteniendo lista de dispositivos"}
          </p>
        </div>
      </div>
    );
  }

  if (availableDevices.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">📍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay dispositivos disponibles</h2>
          <p className="text-gray-600 mb-4">
            No se encontraron dispositivos activos para mostrar en el seguimiento.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Breadcrumb de navegación */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => router.push('/dashboard/tracking')}
                className="px-4 py-2 rounded-md font-medium transition-all bg-blue-500 text-white shadow-sm"
              >
                Seguimiento
              </button>
              {userData?.role !== 'client' && userData?.role !== 'cliente' && (
                <button
                  onClick={() => router.push('/operator-navigation')}
                  className="px-4 py-2 rounded-md font-medium transition-all bg-orange-500 text-white hover:bg-orange-600"
                >
                  Navegación
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {selectedDeviceId ? (
                  <>Seguimiento: {selectedDeviceId}</>
                ) : (
                  "Selecciona un dispositivo para rastrear"
                )}
              </h1>
              <p className="text-gray-600">
                {orderId ? `Modo: Seguimiento de Orden` : `Modo: Seguimiento de Dispositivo`}
                {userData && (
                  <span className="ml-2 text-sm">
                    ({userData.role === 'provider' ? 'Vista Proveedor' : 
                      userData.role === 'client' ? 'Vista Cliente' : 'Vista Admin'})
                  </span>
                )}
              </p>
              {userData && (
                <p className="text-sm text-gray-500">
                  Usuario: {userData.name} ({userData.role})
                </p>
              )}
            </div>
            
            <div className="lg:w-80">
              <div>
                <label htmlFor="deviceSelect" className="block text-sm font-medium text-gray-700 mb-2">
                  Dispositivo a rastrear:
                </label>
                <select
                  id="deviceSelect"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDeviceId}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                >
                  <option value="">Seleccionar dispositivo...</option>
                  
                  {initialTrackingId && (
                    <optgroup label="Desde URL">
                      <option value={initialTrackingId}>
                        {initialTrackingId} ({orderId ? 'orden' : 'dispositivo'} desde URL)
                      </option>
                    </optgroup>
                  )}
                  
                  {devicesWithGPS.length > 0 && (
                    <optgroup label="Dispositivos con GPS válido">
                      {devicesWithGPS.map(device => (
                        <option key={device.entity_id} value={device.entity_id}>
                          {device.entity_id} ({device.entity_type}) - {device.status || 'activo'}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  
                  {availableDevices.length > devicesWithGPS.length && (
                    <optgroup label="Dispositivos sin GPS">
                      {availableDevices
                        .filter(device => !devicesWithGPS.some(d => d.entity_id === device.entity_id))
                        .map(device => (
                          <option key={device.entity_id} value={device.entity_id}>
                            {device.entity_id} ({device.entity_type}) - Sin GPS
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>
          </div>

          {selectedDeviceId && (
            <div className="mt-4">
              {devicesWithGPS.find(d => d.entity_id === selectedDeviceId) ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Dispositivo activo con GPS válido
                      </p>
                      <p className="text-sm text-green-600">
                        Actualización en tiempo real cada 15 segundos
                      </p>
                      {availableDevices.find(d => d.entity_id === selectedDeviceId)?.name && (
                        <p className="text-xs text-green-600">
                          {availableDevices.find(d => d.entity_id === selectedDeviceId)?.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-800">
                        Dispositivo sin coordenadas GPS válidas
                      </p>
                      {devicesWithGPS.length > 0 && (
                        <p className="text-sm text-yellow-600">
                          Sugerencia: Prueba con {devicesWithGPS[0].name || devicesWithGPS[0].entity_id}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-lg shadow-sm border overflow-hidden">
          {selectedDeviceId ? (
            <VehicleMap userId={selectedDeviceId} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">🗺️</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Selecciona un dispositivo para rastrear
                </h4>
                <p className="text-gray-600">
                  {devicesWithGPS.length > 0 ? 
                    `${devicesWithGPS.length} dispositivos con GPS disponibles` :
                    "Esperando dispositivos con ubicación válida"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-semibold">Total Dispositivos</div>
            <div className="text-lg font-bold text-blue-800">{availableDevices.length}</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-green-600 font-semibold">Con GPS Válido</div>
            <div className="text-lg font-bold text-green-800">{devicesWithGPS.length}</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-orange-600 font-semibold">Dispositivo Actual</div>
            <div className="text-sm font-bold text-orange-800">{selectedDeviceId || 'Ninguno'}</div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-purple-600 font-semibold">Estado</div>
            <div className="text-sm font-bold text-purple-800">
              {selectedDeviceId ? 'Rastreando' : 'En espera'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;