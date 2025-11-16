// /services/extendOrder.ts
export type ExtendOrderResult = {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
  };
  
  export const extendOrder = async (orderId: number, extraDays: number, token: string): Promise<ExtendOrderResult> => {
    try {
      console.log("Extendiendo orden:", orderId, "días:", extraDays);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/orders/${orderId}/extend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ extra_days: extraDays }),
      });
      console.log("ExtendOrder response status:", res.status);
  
      if (!res.ok) {
        if (res.status === 401) {
          return { success: false, error: "Unauthorized", message: "Sesión expirada" };
        }
        const errorData = await res.json().catch(() => ({}));
        return { success: false, error: `HTTP ${res.status}`, message: errorData.message || "Error extendiendo la orden" };
      }
  
      const apiResponse = await res.json();
      return { success: true, data: apiResponse, message: apiResponse.message || "Orden extendida" };
    } catch (err: any) {
      console.error("Error en extendOrder:", err);
      return { success: false, error: "Network Error", message: "Error de conexión al extender la orden" };
    }
  };
  