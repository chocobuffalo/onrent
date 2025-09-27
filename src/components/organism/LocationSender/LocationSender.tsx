// src/components/organism/LocationSender/LocationSender.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface LocationSenderProps {
  deviceId: string;
  entityType?: string;
  autoStart?: boolean;
  intervalSeconds?: number;
  onLocationSent?: (location: GeolocationPosition) => void;
  onError?: (error: string) => void;
}

interface LocationData {
  deviceId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export default function LocationSender({
  deviceId,
  entityType = "maquinaria",
  autoStart = false,
  intervalSeconds = 10,
  onLocationSent,
  onError
}: LocationSenderProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string>("");
  const [lastSentTime, setLastSentTime] = useState<string>("");
  const [sendCount, setSendCount] = useState(0);
  const [permissions, setPermissions] = useState<PermissionState>("prompt");

  // Referencias para control de intervalos
  const watchId = useRef<number | null>(null);
  const sendInterval = useRef<NodeJS.Timeout | null>(null);

  // Verificar permisos de geolocalización
  useEffect(() => {
    const checkPermissions = async () => {
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          setPermissions(result.state);
          
          // Escuchar cambios en permisos
          result.addEventListener('change', () => {
            setPermissions(result.state);
            if (result.state === 'denied') {
              stopSharing();
            }
          });
        } catch (error) {
          console.log("No se pueden verificar permisos automáticamente");
        }
      }
    };

    checkPermissions();
  }, []);

  // Auto iniciar si está configurado
  useEffect(() => {
    if (autoStart && deviceId) {
      startSharing();
    }
    
    return () => {
      stopSharing();
    };
  }, [autoStart, deviceId]);

  // Función para obtener ubicación actual
  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalización no soportada por este navegador"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          let errorMessage = "Error obteniendo ubicación: ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Permisos denegados por el usuario";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Ubicación no disponible";
              break;
            case error.TIMEOUT:
              errorMessage += "Tiempo de espera agotado";
              break;
            default:
              errorMessage += "Error desconocido";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  // Función para enviar ubicación al backend
  const sendLocationToBackend = async (position: GeolocationPosition): Promise<boolean> => {
    try {
      const locationData: LocationData = {
        deviceId: deviceId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date().toISOString(),
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        heading: position.coords.heading,
        speed: position.coords.speed
      };

      console.log(`📤 Enviando ubicación para ${deviceId}:`, locationData);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/location/update`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Ubicación enviada exitosamente:`, result);
        
        setLastSentTime(new Date().toLocaleTimeString());
        setSendCount(prev => prev + 1);
        setError("");
        
        // Callback opcional
        if (onLocationSent) {
          onLocationSent(position);
        }
        
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      console.error(`❌ Error enviando ubicación:`, errorMessage);
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      return false;
    }
  };

  // Función para obtener y enviar ubicación
  const obtainAndSendLocation = async () => {
    try {
      setError("");
      
      const position = await getCurrentLocation();
      setCurrentLocation(position);
      
      const success = await sendLocationToBackend(position);
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error obteniendo ubicación";
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      return false;
    }
  };

  // Iniciar compartir ubicación
  const startSharing = async () => {
    if (isSharing) return;
    
    console.log(`🚀 Iniciando compartir ubicación para ${deviceId} cada ${intervalSeconds}s`);
    
    setIsSharing(true);
    setError("");
    setSendCount(0);
    
    // Enviar ubicación inicial
    const success = await obtainAndSendLocation();
    
    if (success) {
      // Configurar envío periódico
      sendInterval.current = setInterval(async () => {
        await obtainAndSendLocation();
      }, intervalSeconds * 1000);
    } else {
      // Si falló el primer envío, detener
      setIsSharing(false);
    }
  };

  // Detener compartir ubicación
  const stopSharing = () => {
    console.log(`🛑 Deteniendo compartir ubicación para ${deviceId}`);
    
    setIsSharing(false);
    
    // Limpiar interval
    if (sendInterval.current) {
      clearInterval(sendInterval.current);
      sendInterval.current = null;
    }
    
    // Limpiar watch (si se usara)
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  // Envío manual de ubicación
  const sendOnce = async () => {
    setError("");
    await obtainAndSendLocation();
  };

  return (
    <div className="location-sender bg-white rounded shadow p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          📡 Compartir Ubicación
        </h5>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge ${isSharing ? 'bg-success' : 'bg-secondary'}`}>
            {isSharing ? '🟢 ACTIVO' : '🔴 INACTIVO'}
          </span>
          {permissions === 'denied' && (
            <span className="badge bg-danger">Sin permisos</span>
          )}
        </div>
      </div>

      {/* Información del dispositivo */}
      <div className="mb-3">
        <div className="row">
          <div className="col-md-6">
            <small className="text-muted">Dispositivo ID:</small>
            <div className="fw-bold font-monospace">{deviceId}</div>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Tipo:</small>
            <div className="fw-bold">{entityType}</div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="mb-3">
        <div className="d-flex gap-2 flex-wrap">
          {!isSharing ? (
            <button 
              onClick={startSharing}
              className="btn btn-success"
              disabled={!deviceId || permissions === 'denied'}
            >
              🚀 Iniciar Compartir
            </button>
          ) : (
            <button 
              onClick={stopSharing}
              className="btn btn-danger"
            >
              🛑 Detener
            </button>
          )}
          
          <button 
            onClick={sendOnce}
            className="btn btn-outline-primary"
            disabled={!deviceId || permissions === 'denied'}
          >
            📤 Enviar Ahora
          </button>
          
          <div className="btn-group">
            <button className="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
              ⚙️ {intervalSeconds}s
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" onClick={() => {/* setInterval logic */}}>5 segundos</button></li>
              <li><button className="dropdown-item" onClick={() => {/* setInterval logic */}}>10 segundos</button></li>
              <li><button className="dropdown-item" onClick={() => {/* setInterval logic */}}>30 segundos</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Estados y estadísticas */}
      <div className="row mb-3">
        <div className="col-md-4">
          <small className="text-muted">Ubicaciones enviadas:</small>
          <div className="fw-bold text-primary">{sendCount}</div>
        </div>
        <div className="col-md-4">
          <small className="text-muted">Último envío:</small>
          <div className="fw-bold">{lastSentTime || 'Nunca'}</div>
        </div>
        <div className="col-md-4">
          <small className="text-muted">Estado GPS:</small>
          <div className={`fw-bold ${currentLocation ? 'text-success' : 'text-muted'}`}>
            {currentLocation ? 'Disponible' : 'Sin señal'}
          </div>
        </div>
      </div>

      {/* Información de ubicación actual */}
      {currentLocation && (
        <div className="alert alert-info py-2 mb-3">
          <small>
            <strong>📍 Ubicación actual:</strong><br/>
            <strong>Lat:</strong> {currentLocation.coords.latitude.toFixed(6)}<br/>
            <strong>Lng:</strong> {currentLocation.coords.longitude.toFixed(6)}<br/>
            <strong>Precisión:</strong> ±{currentLocation.coords.accuracy?.toFixed(0)}m<br/>
            {currentLocation.coords.speed && (
              <><strong>Velocidad:</strong> {(currentLocation.coords.speed * 3.6).toFixed(1)} km/h<br/></>
            )}
            <strong>Timestamp:</strong> {new Date(currentLocation.timestamp).toLocaleString('es-ES')}
          </small>
        </div>
      )}

      {/* Errores */}
      {error && (
        <div className="alert alert-danger py-2 mb-3">
          <small>
            <strong>❌ Error:</strong> {error}
          </small>
        </div>
      )}

      {/* Advertencia de permisos */}
      {permissions === 'prompt' && (
        <div className="alert alert-warning py-2 mb-3">
          <small>
            <strong>⚠️ Permisos requeridos:</strong> Se solicitarán permisos de ubicación al iniciar.
          </small>
        </div>
      )}

      {permissions === 'denied' && (
        <div className="alert alert-danger py-2 mb-3">
          <small>
            <strong>🚫 Permisos denegados:</strong> Necesitas habilitar la ubicación en tu navegador para usar esta función.
            <br/>
            <strong>Instrucciones:</strong> Ve a configuración del navegador {" > "} Privacidad {" > "} Ubicación {" > "} Permitir para este sitio
          </small>
        </div>
      )}

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-3">
          <summary className="text-muted cursor-pointer small">🛠️ Debug Info</summary>
          <div className="mt-2 p-2 bg-light rounded small font-monospace">
            <div>Device ID: {deviceId}</div>
            <div>Entity Type: {entityType}</div>
            <div>Is Sharing: {isSharing.toString()}</div>
            <div>Permissions: {permissions}</div>
            <div>Send Count: {sendCount}</div>
            <div>Current Location: {currentLocation ? 'Available' : 'None'}</div>
            <div>Error: {error || 'None'}</div>
            <div>Interval: {intervalSeconds}s</div>
          </div>
        </details>
      )}
    </div>
  );
}