import { GetTransferDetailResult } from "@/types/orders";

export default async function getTransferDetail(
  token: string, 
  transferId: number
): Promise<GetTransferDetailResult> {
  try {
    console.log("Obteniendo detalle de traslado:", transferId);
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/operator/transfer/${transferId}`,
      {
        method: 'GET',
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
        message: errorData.message || "Error al cargar el detalle del traslado."
      };
    }

    const apiResponse = await res.json();

    return {
      success: true,
      data: apiResponse,
      message: "Detalle de traslado cargado exitosamente."
    };

  } catch (error: any) {
    console.error("Error en getTransferDetail:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al cargar el detalle del traslado. Por favor, intenta nuevamente."
    };
  }
}

