import { OperatorDetailResponse } from "@/types/operator";

export default async function getOperatorDetail(
  token: string,
  id: number
): Promise<OperatorDetailResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/provider/operator/operators?operator_id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      throw new Error(`Error ${res.status}: No se pudo obtener el detalle del operador`);
    }

    return res.json();
  } catch (error: any) {
    console.error("Error en getOperatorDetail:", error);
    return null;
  }
}
