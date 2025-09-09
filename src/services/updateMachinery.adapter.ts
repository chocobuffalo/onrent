import createAxiosInstance from "@/utils/axiosInstance";
import { UpdateMachineryRequest, UpdateMachineryResponse, ApiMachineryResponse } from "@/types/machinary";

export const updateMachinery = async (id: number, machineryData: UpdateMachineryRequest): Promise<UpdateMachineryResponse> => {
  try {
    console.log("UPDATE - ID:", id);
    console.log("UPDATE - Datos recibidos:", machineryData);

    const formData = new FormData();

    Object.entries(machineryData).forEach(([key, value]) => {
      if (key !== 'image' && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Agregar imagen si existe
    if (machineryData.image) {
      formData.append('image', machineryData.image);
    }

    const axiosInstance = await createAxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_API_URL_ORIGIN,
    });

    const response = await axiosInstance.put(`/api/machinery/update/${id}`, formData);

    console.log("UPDATE - Respuesta exitosa:", response.data);

    const apiResponse = response.data as ApiMachineryResponse;

    return {
      success: true,
      data: apiResponse,
      message: apiResponse.message || "Maquinaria actualizada exitosamente"
    };

  } catch (error: any) {
    console.log("UPDATE - Error:", error.response?.data);
    console.log("UPDATE - Error status:", error.response?.status);

    // Si es error 401, el interceptor ya manejó el logout automático
    if (error.response?.status === 401) {
      return {
        success: false,
        error: "Unauthorized",
        message: "Sesión expirada. Redirigiendo al login..."
      };
    }

    // Para error 422, mostrar mensaje más específico
    if (error.response?.status === 422) {
      let backendMessage = "Error de validación. Verifica los datos enviados.";
      
      if (error.response?.data) {
        console.log("UPDATE - Detalles del error 422:", error.response.data);
        
        // Intentar extraer el mensaje más específico del backend
        if (error.response.data.message) {
          backendMessage = error.response.data.message;
        } else if (error.response.data.error) {
          backendMessage = error.response.data.error;
        } else if (error.response.data.errors) {
          // Si hay errores específicos por campo
          const fieldErrors = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          backendMessage = `Errores de validación: ${fieldErrors}`;
        }
      }
      
      return {
        success: false,
        error: "Validation Error",
        message: backendMessage
      };
    }

    // Para cualquier otro error, usar mensaje genérico
    return {
      success: false,
      error: error.response ? `HTTP ${error.response.status}` : "Network Error",
      message: error.response?.data?.message || "Error al actualizar la maquinaria. Por favor, intenta nuevamente."
    };
  }
};