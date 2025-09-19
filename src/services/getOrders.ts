import { OrderResponse, GetOrdersResult } from "@/types/orders";

export const getOrdersList = async (token: string): Promise<GetOrdersResult> => {
  try {
    console.log("Iniciando petición para obtener lista de órdenes...");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/orders/my-orders`, {
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

      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: `HTTP ${res.status}`,
        message: errorData.message || "Error al cargar las órdenes. Por favor, intenta nuevamente."
      };
    }

    const apiResponse = await res.json();
    console.log("Datos procesados:", apiResponse?.length || 0, "órdenes");

    const ordersData: OrderResponse[] = Array.isArray(apiResponse) ? apiResponse : [];

    return {
      success: true,
      data: ordersData,
      message: `Se cargaron ${ordersData.length} órdenes exitosamente.`
    };

  } catch (error: any) {
    console.error("Error en getOrdersList:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al cargar las órdenes. Por favor, intenta nuevamente."
    };
  }
};