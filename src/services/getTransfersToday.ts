import { GetTransfersResult, Transfer } from "@/types/orders";

export default async function getTransfersToday(token: string): Promise<GetTransfersResult> {
  try {
    console.log("Iniciando petición para obtener traslados de hoy...");
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/operator/transfers/today`,
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
      
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: `HTTP ${res.status}`,
        message: errorData.message || "Error al cargar los traslados. Por favor, intenta nuevamente."
      };
    }

    const apiResponse = await res.json();
    console.log("Datos procesados:", apiResponse?.length || 0, "traslados");

    const transfersData: Transfer[] = Array.isArray(apiResponse) ? apiResponse : [];

    return {
      success: true,
      data: transfersData,
      message: `Se cargaron ${transfersData.length} traslados exitosamente.`
    };

  } catch (error: any) {
    console.error("Error en getTransfersToday:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al cargar los traslados. Por favor, intenta nuevamente."
    };
  }
}




