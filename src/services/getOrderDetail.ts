import { GetOrderDetailResult } from "@/types/orders";

export const getOrderDetail = async (orderId: number, token: string): Promise<GetOrderDetailResult> => {
  try {
    console.log("Obteniendo detalle de orden:", orderId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/orders/${orderId}`, {
      method: "GET",
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
      if (res.status === 404) {
        return {
          success: false,
          error: "Not Found",
          message: "La orden solicitada no existe."
        };
      }
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: `HTTP ${res.status}`,
        message: errorData.message || "Error al cargar el detalle de la orden."
      };
    }
    
    const apiResponse = await res.json();
    
    return {
      success: true,
      data: apiResponse,
      message: "Detalle de orden cargado exitosamente."
    };
    
  } catch (error: any) {
    console.error("Error en getOrderDetail:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al cargar el detalle de la orden. Por favor, intenta nuevamente."
    };
  }
};