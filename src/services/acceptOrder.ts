import { BaseApiResult } from "@/types/orders";

export const acceptOrder = async (orderId: number, token: string): Promise<BaseApiResult> => {
  try {
    console.log("Iniciando petición para aceptar orden:", orderId);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/provider/orders/${orderId}/accept`, {
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
        message: errorData.message || "Error al aceptar la orden. Por favor, intenta nuevamente."
      };
    }

    const apiResponse = await res.json();
    console.log("Orden aceptada exitosamente");

    return {
      success: true,
      message: "Orden aceptada exitosamente."
    };

  } catch (error: any) {
    console.error("Error en acceptOrder:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al aceptar la orden. Por favor, intenta nuevamente."
    };
  }
};