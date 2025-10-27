// src/services/rateOrder.ts
export async function rateOrder(orderId: number, rating: number, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/orders/${orderId}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || "Error al calificar la orden");
    return { success: true, message: data?.message || "Calificación registrada" };
  }
  