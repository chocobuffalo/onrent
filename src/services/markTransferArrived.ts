import { MarkTransferArrivedResult } from "@/types/orders";

export default async function markTransferArrived(
  token: string, 
  transferId: number
): Promise<MarkTransferArrivedResult> {
  try {
    console.log("Marcando traslado como completado:", transferId);
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/operator/transfer/${transferId}/arrived`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Respuesta del servidor:", res.status);

    if (!res.ok) {
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
      
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: `HTTP ${res.status}`,
        message: errorData.message || "Error al marcar el traslado como completado."
      };
    }

    const apiResponse = await res.json();

    return {
      success: true,
      message: "Traslado marcado como completado exitosamente."
    };

  } catch (error: any) {
    console.error("Error en markTransferArrived:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al marcar el traslado como completado. Por favor, intenta nuevamente."
    };
  }
}
