import { DeleteOperatorResponse } from "@/types/operator";

export default async function deleteOperator(
  token: string,
  id: number
): Promise<DeleteOperatorResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/provider/operator/delete/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        error: `HTTP ${res.status}`,
        message: errorText || "Error al eliminar el operador",
      };
    }

    return res.json();
  } catch (error: any) {
    console.error("Error en deleteOperator:", error);
    return {
      success: false,
      error: "Network Error",
      message: "Error de conexión. Intenta nuevamente.",
    };
  }
}
