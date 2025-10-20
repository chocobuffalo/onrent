import {
    CreateOperatorRequest,
    CreateOperatorResponse,
    ApiOperatorResponse,
  } from "@/types/operator";
  
  export default async function createOperator(
    operatorData: CreateOperatorRequest,
    token: string
  ): Promise<CreateOperatorResponse> {
    try {
      console.log("Iniciando creación de operador:", operatorData);
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/provider/operator/create_full`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(operatorData),
        }
      );
  
      console.log("Respuesta del servidor:", res.status);
  
      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          error: `HTTP ${res.status}`,
          message: errorText || "Error al crear el operador",
        };
      }
  
      const apiResponse = (await res.json()) as ApiOperatorResponse;
      console.log("Datos de respuesta:", apiResponse);
  
      return {
        success: true,
        data: apiResponse,
        message: apiResponse.message || "Operador creado exitosamente",
      };
    } catch (error: any) {
      console.error("Error en createOperator:", error);
      return {
        success: false,
        error: "Network Error",
        message: "Error de conexión. Intenta nuevamente.",
      };
    }
  }
  