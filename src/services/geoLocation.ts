// src/services/geolocationService.ts

interface GeolocationCoords {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

/**
 * Servicio para manejar geolocalización del usuario
 */
export class GeolocationService {
  
  /**
   * Obtiene la ubicación actual del usuario
   */
  static async getCurrentPosition(): Promise<GeolocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada por este navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: GeolocationCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          console.log('latitud:', coords.lat);
          console.log('longitud:', coords.lng);

          resolve(coords);
        },
        (error) => {
          let errorMessage = 'Error desconocido al obtener ubicación';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permiso de ubicación denegado por el usuario';
              console.error('❌ Usuario denegó el permiso de ubicación');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Información de ubicación no disponible';
              console.error('❌ Ubicación no disponible');
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado al solicitar ubicación';
              console.error('❌ Timeout al obtener ubicación');
              break;
            default:
              console.error('❌ Error desconocido:', error.message);
              break;
          }

          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Guarda la ubicación en localStorage
   */
  static saveLocation(coords: GeolocationCoords): void {
    try {
      localStorage.setItem('userLocation', JSON.stringify(coords));
      console.log('💾 Ubicación guardada en localStorage');
    } catch (error) {
      console.error('❌ Error guardando ubicación:', error);
    }
  }

  /**
   * Recupera la ubicación guardada
   */
  static getSavedLocation(): GeolocationCoords | null {
    try {
      const saved = localStorage.getItem('userLocation');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('❌ Error recuperando ubicación:', error);
      return null;
    }
  }

  /**
   * Obtiene y guarda la ubicación del usuario
   */
  static async getAndSaveLocation(): Promise<GeolocationCoords> {
    const coords = await this.getCurrentPosition();
    this.saveLocation(coords);
    return coords;
  }
}