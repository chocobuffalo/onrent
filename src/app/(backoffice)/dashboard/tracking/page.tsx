// src/app/(backoffice)/dashboard/tracking/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import VehicleMap from "@/components/organism/AmazonLocationService/VehicleMap";
import LocationSender from "@/components/organism/LocationSender/LocationSender";

interface LocationData {
  entity_id: string;
  entity_type: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const deviceIdFromUrl = searchParams.get("deviceId");
  
  const [userId, setUserId] = useState<string>("");
 
  const [userData, setUserData] = useState<any>(null);
  const [availableDevices, setAvailableDevices] = useState<LocationData[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [showLocationSender, setShowLocationSender] = useState(false);

  // Cargar datos de usuario desde localStorage
  useEffect(() => {
    console.log("=== DEBUGGING TRACKING PAGE ===");
    
    const apiUserData = localStorage.getItem("api_user_data");
    const apiToken = localStorage.getItem("api_access_token");
    
    console.log("localStorage api_user_data:", apiUserData);
    console.log("localStorage api_access_token:", apiToken);
    
    if (apiUserData) {
      try {
        const parsedUserData = JSON.parse(apiUserData);
        console.log("Usuario parseado:", parsedUserData);
        setUserData(parsedUserData);
        
        // Si hay deviceId en URL, usarlo
        if (deviceIdFromUrl) {
          setUserId(deviceIdFromUrl);
          setSelectedDeviceId(deviceIdFromUrl);
        }
      } catch (error) {
        console.error("Error parseando datos de usuario:", error);
      }
    } else {
      console.log("No hay datos de usuario en localStorage");
      // Solo usar deviceId de URL si está presente
      if (deviceIdFromUrl) {
        setUserId(deviceIdFromUrl);
        setSelectedDeviceId(deviceIdFromUrl);
      }
    }
  }, [deviceIdFromUrl]);

  // Cargar dispositivos disponibles usando el endpoint del backend
  useEffect(() => {
    const fetchAvailableDevices = async () => {
      try {
        // Usar el endpoint real del backend
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/location/sync/list`;
        const response = await fetch(apiUrl);
        
        if (response.ok) {
          const data = await response.json();
          console.log("📡 Dispositivos cargados desde backend:", data);
          
          // El backend devuelve locations array
          const devices = data.locations || [];
          setAvailableDevices(devices);
          
          // Auto-seleccionar primer dispositivo si no hay deviceId en URL
          if (!deviceIdFromUrl && devices.length > 0) {
            const firstDevice = devices[0];
            setSelectedDeviceId(firstDevice.entity_id);
            setUserId(firstDevice.entity_id);
          }
        } else {
          console.error("Error loading devices:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error loading available devices:", error);
      }
    };

    fetchAvailableDevices();
  }, [deviceIdFromUrl]);



  // Función para cambiar dispositivo seleccionado
  const handleDeviceChange = (newDeviceId: string) => {
    setSelectedDeviceId(newDeviceId);
    setUserId(newDeviceId);
    
    // Actualizar URL sin recargar página
    const url = new URL(window.location.href);
    if (newDeviceId) {
      url.searchParams.set('deviceId', newDeviceId);
    } else {
      url.searchParams.delete('deviceId');
    }
    window.history.replaceState({}, '', url.toString());
  };

  // Filtrar dispositivos con GPS válido
  const devicesWithGPS = availableDevices.filter(device => {
    const hasLocation = device.location || (device.latitude !== undefined && device.longitude !== undefined);
    if (!hasLocation) return false;
    
    const lat = device.location?.latitude ?? device.latitude ?? 0;
    const lng = device.location?.longitude ?? device.longitude ?? 0;
    
    return Math.abs(lat) > 0.001 || Math.abs(lng) > 0.001;
  });

  // Debug: mostrar deviceId actual
  console.log("📍 DeviceId actual:", userId);
  console.log("📊 Dispositivos con GPS:", devicesWithGPS.length);

  return (
    <div style={{ height: "100vh", width: "100%" }} className="tracking-container">
      {/* Header con controles */}
      <div className="p-4 bg-white border-b">
        <div className="row">
          <div className="col-md-8">
            <h1 className="text-xl font-bold mb-2">
              {selectedDeviceId ? (
                <>Seguimiento de Dispositivo: {selectedDeviceId}</>
              ) : (
                "Selecciona un dispositivo para rastrear"
              )}
            </h1>
            {userData ? (
              <div className="text-muted small">
               
              </div>
            ) : (
              <p className="text-muted small">
                No hay usuario autenticado
              </p>
            )}
          </div>
          
          <div className="col-md-4">
            {/* Selector de dispositivo */}
            <div className="mb-2">
              <label htmlFor="deviceSelect" className="form-label small">
                Seleccionar dispositivo:
              </label>
              <select
                id="deviceSelect"
                className="form-select form-select-sm"
                value={selectedDeviceId}
                onChange={(e) => handleDeviceChange(e.target.value)}
              >
                <option value="">Seleccionar dispositivo...</option>
                
                {deviceIdFromUrl && (
                  <optgroup label="Desde URL">
                    <option value={deviceIdFromUrl}>
                      {deviceIdFromUrl} (parámetro URL)
                    </option>
                  </optgroup>
                )}
                
                {devicesWithGPS.length > 0 && (
                  <optgroup label="Dispositivos con GPS válido">
                    {devicesWithGPS.map(device => (
                      <option key={device.entity_id} value={device.entity_id}>
                        {device.entity_id} ({device.entity_type}) - {device.status}
                      </option>
                    ))}
                  </optgroup>
                )}
                
                {availableDevices.length > devicesWithGPS.length && (
                  <optgroup label="Dispositivos sin GPS">
                    {availableDevices
                      .filter(device => !devicesWithGPS.includes(device))
                      .map(device => (
                        <option key={device.entity_id} value={device.entity_id}>
                          {device.entity_id} ({device.entity_type}) - Sin GPS
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Toggle para enviar mi ubicación */}
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="showLocationSender"
                checked={showLocationSender}
                onChange={(e) => setShowLocationSender(e.target.checked)}
              />
              <label className="form-check-label small" htmlFor="showLocationSender">
                Enviar mi ubicación
              </label>
            </div>
          </div>
        </div>

        {/* Estado del dispositivo seleccionado */}
        {selectedDeviceId && (
          <div className="mt-3">
            {devicesWithGPS.find(d => d.entity_id === selectedDeviceId) ? (
              <div className="alert alert-success py-2">
                <small>
                  <strong>✅ Dispositivo seleccionado:</strong> {selectedDeviceId}
                </small>
              </div>
            ) : availableDevices.length === 0 ? (
              <div className="alert alert-info py-2">
                <small>
                  <strong>🔄 Cargando:</strong> Obteniendo lista de dispositivos...
                </small>
              </div>
            ) : (
              <div className="alert alert-warning py-2">
                <small>
                  <strong>⚠️ Dispositivo seleccionado:</strong> {selectedDeviceId}
                  <br />
                  <small>El mapa mostrará el estado real de GPS del dispositivo</small>
                </small>
              </div>
            )}
          </div>
        )}

        {/* Mensaje cuando no hay dispositivos */}
        {availableDevices.length === 0 && !selectedDeviceId && (
          <div className="alert alert-info mt-3">
            <small>
              <strong>📱 Cargando dispositivos:</strong> Obteniendo lista desde el servidor...
            </small>
          </div>
        )}

        {/* Panel para enviar ubicación */}
        {showLocationSender && userData && (
          <div className="mt-3">
            <LocationSender
              deviceId={userData.user_id.toString()}
              entityType="provider"
              intervalSeconds={10}
              onLocationSent={(location) => {
                console.log("✅ Ubicación enviada:", location);
              }}
              onError={(error) => {
                console.error("❌ Error enviando ubicación:", error);
              }}
            />
          </div>
        )}
      </div>

      {/* Mapa principal */}
      <div style={{ height: "calc(100vh - 200px)", width: "100%" }}>
        {selectedDeviceId ? (
          <VehicleMap userId={selectedDeviceId} />
        ) : (
          <div className="h-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center">
              <h4>Selecciona un dispositivo para rastrear</h4>
              <p className="text-muted">
                {availableDevices.length === 0 ? 
                  "Cargando dispositivos disponibles..." :
                  `${devicesWithGPS.length} dispositivos con GPS disponibles`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}