import createAxiosInstance from "@/utils/axiosInstance";
import { CreateMachineryRequest, CreateMachineryResponse, ApiMachineryResponse } from "@/types/machinary";

export const createMachinery = async (machineryData: CreateMachineryRequest): Promise<CreateMachineryResponse> => {
  try {
    console.log("Iniciando creación de maquinaria:", machineryData);

    // Crear FormData para manejar tanto datos como archivos
    const formData = new FormData();
    
    // Agregar todos los campos al FormData, excluyendo la imagen primero
    Object.entries(machineryData).forEach(([key, value]) => {
      if (key !== 'image' && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Agregar la imagen si existe
    if (machineryData.image) {
      formData.append('image', machineryData.image);
    }

    const axiosInstance = await createAxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_API_URL_ORIGIN
    });

    const response = await axiosInstance.post('/api/machinery/create', formData);
    
    console.log("Respuesta del servidor:", response.status, response.data);

    // Castear la respuesta al tipo correcto
    const apiResponse = response.data as ApiMachineryResponse;

    return {
      success: true,
      data: apiResponse,
      message: apiResponse.message || "Maquinaria creada exitosamente"
    };

  } catch (error: any) {
    console.error("Error en createMachinery:", error);

    // Si es error 401, el interceptor ya manejó el logout automático
    if (error.response?.status === 401) {
      return {
        success: false,
        error: "Unauthorized",
        message: "Sesión expirada. Redirigiendo al login..."
      };
    }

    // Para cualquier otro error, usar mensaje genérico
    return {
      success: false,
      error: error.response ? `HTTP ${error.response.status}` : "Network Error",
      message: error.response?.data?.message || "Error al crear la maquinaria. Por favor, intenta nuevamente."
    };
  }
};