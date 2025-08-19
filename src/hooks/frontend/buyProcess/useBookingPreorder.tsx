"use client";
import { useState } from "react";

interface PreorderItem {
  product_id: number;
  start_date: string;
  end_date: string;
  quantity: number;
  requires_operator: boolean;
  requires_fuel: boolean;
  certification_level: string;
}

interface PreorderPayload {
  session_id?: string;
  items: PreorderItem[];
  project_id?: number;
  client_notes?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export default function useBookingPreorder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const createPreorder = async (payload: PreorderPayload) => {
    try {
      setLoading(true);
      setError(null);

      const apiBase = process.env.NEXT_PUBLIC_API_URL_ORIGIN;
      const url = apiBase
        ? `${apiBase}/api/orders/preorder`
        : `/api/orders/preorder`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const result = await res.json();
      setData(result);

      return result;
    } catch (err: any) {
      setError(err.message || "Error al crear la pre-orden");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPreorder, data, loading, error };
}
