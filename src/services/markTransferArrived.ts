import { MarkTransferArrivedResult } from "@/types/orders";

export default async function markTransferArrived(
  token: string, 
  transferId: number
): Promise<MarkTransferArrivedResult> {
  try {
    console.log("📤 Marcando traslado como completado:", transferId);
    
    // ✅ Obtener ubicación del navegador
    let lat = 0;
    let lng = 0;
    
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        console.log("📍 Ubicación obtenida:", { lat, lng });
      } catch (geoError) {
        console.warn("⚠️ No se pudo obtener la ubicación, usando valores por defecto:", geoError);
        // Usar coordenadas por defecto (Ciudad de México en este caso)
        lat = 19.4326;
        lng = -99.1332;
      }
    } else {
      console.warn("⚠️ Geolocalización no disponible, usando valores por defecto");
      lat = 19.4326;
      lng = -99.1332;
    }
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/operator/transfer/${transferId}/arrived`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // ✅ ENVIAR lat y lng en el body
        body: JSON.stringify({
          lat,
          lng
        })
      }
    );

    console.log("📥 Respuesta del servidor:", res.status);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("❌ Error del backend:", errorData);
      
      if (res.status === 401) {
        return {
          success: false,
          error: "Unauthorized",
          message: "Sesión expirada. Redirigiendo al login..."
        };
      }
      if (res.status === 403) {
        return {
          success: false,
          error: "Forbidden",
          message: "No tienes permiso para completar este traslado."
        };
      }
      if (res.status === 404) {
        return {
          success: false,
          error: "Not Found",
          message: "El traslado solicitado no existe."
        };
      }
      
      if (res.status === 422) {
        let errorMessage = "El traslado no puede ser completado.";
        
        if (errorData.detail && Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          const firstError = errorData.detail[0];
          if (typeof firstError === 'string') {
            errorMessage = firstError;
          } else if (firstError.msg) {
            errorMessage = firstError.msg;
          }
        }
        
        return {
          success: false,
          error: "Validation Error",
          message: errorMessage
        };
      }
      
      return {
        success: false,
        error: `HTTP ${res.status}`,
        message: errorData.message || "Error al marcar el traslado como completado."
      };
    }

    const apiResponse = await res.json();
    console.log("✅ Respuesta exitosa:", apiResponse);

    return {
      success: true,
      message: apiResponse.message || "Traslado marcado como completado exitosamente."
    };

  } catch (error: any) {
    console.error("💥 Error en markTransferArrived:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al marcar el traslado como completado. Por favor, intenta nuevamente."
    };
  }
}
