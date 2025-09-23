import { GetRegionsResult, UpdateRegionResult, UpdateRegionPayload, RegionsApiResponse, UpdateRegionApiResponse, Region } from "@/types/profile";

export const getRegionsList = async (token: string): Promise<GetRegionsResult> => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/regions`;
    console.log("Iniciando petición para obtener lista de regiones...");

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("Respuesta del servidor:", res.status, res.statusText);

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
        message: errorData.message || `Error ${res.status}: ${res.statusText}. Por favor, intenta nuevamente.`
      };
    }

    // El backend devuelve directamente un array de regiones
    const regionsData: Region[] = await res.json();
    console.log("Datos procesados:", regionsData?.length || 0, "regiones");

    return {
      success: true,
      data: regionsData,
      message: `Se cargaron ${regionsData.length} regiones exitosamente.`
    };

  } catch (error: any) {
    console.error("Error en getRegionsList:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al cargar las regiones. Por favor, intenta nuevamente."
    };
  }
};

export const updateUserRegion = async (token: string, payload: UpdateRegionPayload): Promise<UpdateRegionResult> => {
  try {
    console.log("Iniciando petición para actualizar región del usuario...");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/update_region`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
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
        message: errorData.message || "Error al actualizar la región. Por favor, intenta nuevamente."
      };
    }

    const apiResponse: UpdateRegionApiResponse = await res.json();
    console.log("Región actualizada exitosamente");

    return {
      success: true,
      message: apiResponse.message || "Región actualizada exitosamente."
    };

  } catch (error: any) {
    console.error("Error en updateUserRegion:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error al actualizar la región. Por favor, intenta nuevamente."
    };
  }
};