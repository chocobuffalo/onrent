import { OperatorResponse } from "@/types/operator";

export default async function getOperators(token: string): Promise<OperatorResponse[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/provider/operator/operators`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      throw new Error(`Error ${res.status}: No se pudo obtener la lista de operadores`);
    }

    return res.json();
  } catch (error: any) {
    console.error("Error en getOperators:", error);
    return [];
  }
}
