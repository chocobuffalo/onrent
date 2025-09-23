import { BaseApiResult } from "@/types/orders";

export const rejectOrder = async (orderId: number, token: string): Promise<BaseApiResult> => {
  try {
    console.log("Iniciando petición para rechazar orden:", orderId);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/provider/orders/${orderId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("Respuesta del servidor:", res.status);
    
    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Unauthorized",
          message: "Sesión expirada. Redirigiendo al login..."
        };
      }

      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: `HTTP ${res.status}`,
        message: errorData.message || "Error al rechazar la orden. Por favor, intenta nuevamente."
      };
    }

    const apiResponse = await res.json();
    console.log("Orden rechazada exitosamente");

    return {
      success: true,
      message: "Orden rechazada exitosamente."
    };

  } catch (error: any) {
    console.error("Error en rejectOrder:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al rechazar la orden. Por favor, intenta nuevamente."
    };
  }
};