import createAxiosInstance from "@/utils/axiosInstance";
import { MachineryResponse, GetMachineryResult } from "@/types/machinary";


interface ApiMachineryListResponse {
  machines?: MachineryResponse[];
  data?: MachineryResponse[];
  machineries?: MachineryResponse[];
  [key: string]: any;
}

export const getMachineryList = async (): Promise<GetMachineryResult> => {
  try {
    console.log("Iniciando petición para obtener lista de maquinarias...");

    const axiosInstance = await createAxiosInstance({
      baseURL: process.env.NEXT_PUBLIC_API_URL_ORIGIN,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await axiosInstance.get('/api/machinery/list');
    
    console.log("Respuesta del servidor:", response.status, response.data);

    // Castear la respuesta al tipo correcto
    const apiResponse = response.data as ApiMachineryListResponse;
    
    // Validar la estructura de la respuesta
    let machineryData: MachineryResponse[] = [];
    
    // Según las imágenes, los datos vienen en diferentes formatos
    if (apiResponse?.machines && Array.isArray(apiResponse.machines)) {
      machineryData = apiResponse.machines;
    } else if (Array.isArray(apiResponse)) {
      machineryData = apiResponse as MachineryResponse[];
    } else if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      machineryData = apiResponse.data;
    } else if (apiResponse?.machineries && Array.isArray(apiResponse.machineries)) {
      machineryData = apiResponse.machineries;
    } else {
      console.warn("Estructura de respuesta inesperada:", apiResponse);
      machineryData = [];
    }

    return {
      success: true,
      data: machineryData,
      message: `Se cargaron ${machineryData.length} maquinarias exitosamente.`
    };

  } catch (error: any) {
    console.error("Error en getMachineryList:", error);

   
    if (error.response?.status === 401) {
      return {
        success: false,
        error: "Unauthorized",
        message: "Sesión expirada. Redirigiendo al login..."
      };
    }


    return {
      success: false,
      error: error.response ? `HTTP ${error.response.status}` : "Network Error",
      message: "Error al cargar las maquinarias. Por favor, intenta nuevamente."
    };
  }
};