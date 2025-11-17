"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import "@/components/organism/Support/support.scss";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_ORIGIN || "";

export default function IncidentForm({ defaultOrderId }: { defaultOrderId?: number }) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken || (session as any)?.access_token || "";

  const [orderId, setOrderId] = useState<number | "">(defaultOrderId ?? "");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    console.debug("[Support][IncidentForm] submit start", { orderId, description, file });

    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "");
    console.debug("[Support][IncidentForm] authToken length:", authToken ? authToken.length : 0);

    if (!orderId || String(orderId).trim() === "") {
      setMessage("Selecciona una orden válida.");
      return;
    }
    if (description.trim().length < 10) {
      setMessage("Describe el problema (mínimo 10 caracteres).");
      return;
    }
    if (!authToken) {
      setMessage("No autorizado. Inicia sesión e intenta de nuevo.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("order_id", String(orderId));
      fd.append("description", description);
      if (file) fd.append("attachment", file);

      const url = `${API_BASE_URL}/support/incidents`;
      console.debug("[Support][IncidentForm] POST URL:", url);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: fd,
      });

      console.debug("[Support][IncidentForm] response status", res.status);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("[Support][IncidentForm] server error body", json);
        const err = json?.detail || json?.warning || json?.message || "Error creando incidencia";
        throw new Error(err);
      }

      const ref = json.reference || json.id;
      setMessage(`Incidencia creada: ${ref}`);
      setDescription("");
      setFile(null);
      setOrderId("");
    } catch (err: any) {
      console.error("[Support][IncidentForm] submit error", err);
      setMessage(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support__panel">
      <h3 className="support__panel-title">Crear incidencia</h3>
      <form onSubmit={submit} className="support__panel-form" noValidate>
        <label>
          Orden (ID)
          <input
            type="number"
            value={orderId ?? ""}
            onChange={(e) => setOrderId(e.target.value === "" ? "" : Number(e.target.value))}
            required
            className="mt-1"
          />
        </label>

        <label>
          Descripción
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="mt-1"
            minLength={10}
          />
        </label>

        <label>
          Evidencia (opcional)
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1"
          />
        </label>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar incidencia"}
          </button>
          {message && <div className="text-sm" style={{ color: "#374151" }}>{message}</div>}
        </div>
      </form>
    </div>
  );
}
