import { UpdateMachineryRequest, UpdateMachineryResponse, ApiMachineryResponse } from "@/types/machinary";

export const updateMachinery = async (id: number, machineryData: UpdateMachineryRequest, token: string): Promise<UpdateMachineryResponse> => {
  try {
    console.log("UPDATE - ID:", id);
    console.log("UPDATE - Datos recibidos:", machineryData);
    console.log("UPDATE - Token:", token ? "Token presente" : "Token faltante");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/machinery/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(machineryData),
    });

    console.log("UPDATE - Respuesta del servidor:", res.status);

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Unauthorized",
          message: "Sesión expirada. Redirigiendo al login..."
        };
      }

      const errorData = await res.json().catch(() => ({}));

      if (res.status === 422) {
        let backendMessage = "Error de validación. Verifica los datos enviados.";
        
        console.log("UPDATE - Detalles del error 422:", errorData);
        
        if (errorData.message) {
          backendMessage = errorData.message;
        } else if (errorData.error) {
          backendMessage = errorData.error;
        } else if (errorData.errors) {
          const fieldErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          backendMessage = `Errores de validación: ${fieldErrors}`;
        }
        
        return {
          success: false,
          error: "Validation Error",
          message: backendMessage
        };
      }

      return {
        success: false,
        error: `HTTP ${res.status}`,
        message: errorData.message || "Error al actualizar la maquinaria. Por favor, intenta nuevamente."
      };
    }

    const apiResponse = await res.json() as ApiMachineryResponse;
    console.log("UPDATE - Respuesta exitosa:", apiResponse);

    return {
      success: true,
      data: apiResponse,
      message: apiResponse.message || "Maquinaria actualizada exitosamente"
    };

  } catch (error: any) {
    console.error("UPDATE - Error de red:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error de conexión. Por favor, intenta nuevamente."
    };
  }
};