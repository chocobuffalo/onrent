// src/services/dismissRating.ts
export async function dismissRating(orderId: number, token: string) {
    const res = await fetch(`/api/orders/${orderId}/rating/dismiss`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dismissed: true }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || "Error al descartar la calificación");
    return { success: true, message: data?.message || "Modal descartado" };
  }
  