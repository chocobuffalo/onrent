import { CreateMachineryRequest, CreateMachineryResponse, ApiMachineryResponse } from "@/types/machinary";

export default async function createMachinery(machineryData: CreateMachineryRequest, token: string): Promise<CreateMachineryResponse> {
  try {
    console.log("Iniciando creación de maquinaria:", machineryData);
    console.log("Token recibido:", token ? "Token presente" : "Token faltante");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/machinery/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(machineryData),
    });

    console.log("Respuesta del servidor:", res.status);
    
    if (!res.ok) {
      console.log("Error HTTP:", res.status);
      const errorText = await res.text();
      console.log("Respuesta de error:", errorText);
      
      return {
        success: false,
        error: `HTTP ${res.status}`,
        message: errorText || "Error al crear la maquinaria"
      };
    }

    const apiResponse = await res.json() as ApiMachineryResponse;
    console.log("Datos de respuesta:", apiResponse);

    return {
      success: true,
      data: apiResponse,
      message: apiResponse.message || "Maquinaria creada exitosamente"
    };

  } catch (error: any) {
    console.error("Error en createMachinery:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error de conexión. Intenta nuevamente."
    };
  }
}