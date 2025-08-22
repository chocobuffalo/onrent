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
  client_notes: string;
  location?: {
    lat: number;
    lng: number;
  };
  // Add any other potentially required fields here
  // state?: string;
  // user_id?: number;
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

      console.log("Response Status:", res.status);
      console.log("Response Headers:", res.headers);

      if (!res.ok) {
        let errorDetails;
        try {
          errorDetails = await res.json();
        } catch (jsonError) {
          try {
            errorDetails = await res.text();
          } catch (textError) {
            errorDetails = "Could not read error response";
          }
        }

        console.error("HTTP Error Details:", {
          status: res.status,
          statusText: res.statusText,
          url: res.url,
          errorBody: errorDetails,
          originalPayload: payload
        });

        const errorMessage = res.status === 422
          ? `Validation Error (422): ${JSON.stringify(errorDetails)}`
          : `HTTP Error ${res.status}: ${res.statusText}`;

        throw new Error(errorMessage);
      }

      const result = await res.json();
      console.log("Successful response:", result);
      setData(result);

      return result;
    } catch (err: any) {
      console.error("Full error object:", err);
      setError(err.message || "Error al crear la pre-orden");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPreorder, data, loading, error };
}
