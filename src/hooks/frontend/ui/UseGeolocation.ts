// src/hooks/frontend/ui/useGeolocation.ts
import { useState, useEffect } from "react";
import { GeolocationService } from "@/services/geoLocation"

interface GeolocationCoords {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

interface UseGeolocationReturn {
  location: GeolocationCoords | null;
  error: string | null;
  loading: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unavailable';
}

/**
 * Hook para obtener la geolocalización del usuario automáticamente
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeolocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unavailable'>('prompt');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por este navegador');
      setPermissionStatus('unavailable');
      setLoading(false);
      return;
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
        
        result.addEventListener('change', () => {
          setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
        });
      }).catch((err) => {
        console.warn('⚠️ No se pudo verificar el estado de permisos:', err);
      });
    }

    const fetchLocation = async () => {
      try {
        const coords = await GeolocationService.getAndSaveLocation();
        
        setLocation(coords);
        setPermissionStatus('granted');
        setError(null);
        
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        
        if (error.message.includes('denegado')) {
          setPermissionStatus('denied');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return {
    location,
    error,
    loading,
    permissionStatus,
  };
};