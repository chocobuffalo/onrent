import { UpdateOperatorRequest, UpdateOperatorResponse } from "@/types/operator";

export default async function updateOperator(
  token: string,
  id: number,
  payload: UpdateOperatorRequest
): Promise<UpdateOperatorResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/provider/operator/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        error: `HTTP ${res.status}`,
        message: errorText || "Error al actualizar el operador",
      };
    }

    return res.json();
  } catch (error: any) {
    console.error("Error en updateOperator:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error de conexión. Intenta nuevamente.",
    };
  }
}
