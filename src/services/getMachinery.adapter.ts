import { MachineryResponse, GetMachineryResult } from "@/types/machinary";

export const getMachineryList = async (token: string): Promise<GetMachineryResult> => {
  try {
    console.log("Iniciando petición para obtener lista de maquinarias...");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/machinery/list`,{
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
        message: errorData.message || "Error al cargar las maquinarias. Por favor, intenta nuevamente."
      };
    }

    const apiResponse = await res.json();
    console.log("Datos procesados:", apiResponse.machines?.length || 0, "maquinarias");

    const machineryData: MachineryResponse[] = apiResponse.machines || [];

    return {
      success: true,
      data: machineryData,
      message: `Se cargaron ${machineryData.length} maquinarias exitosamente.`
    };

  } catch (error: any) {
    console.error("Error en getMachineryList:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al cargar las maquinarias. Por favor, intenta nuevamente."
    };
  }
};