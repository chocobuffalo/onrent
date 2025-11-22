// src/components/organism/Support/IncidentForm.tsx
"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import "./support.scss";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_ORIGIN || "";

export default function IncidentForm({ defaultOrderId }: { defaultOrderId?: number }) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken || (session as any)?.access_token || "";

  const [orderId, setOrderId] = useState<number | "">(defaultOrderId ?? "");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null); // opcional, sólo si API acepta base64
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "");
    if (!orderId || String(orderId).trim() === "") return setMessage("Selecciona una orden válida.");
    if (description.trim().length < 10) return setMessage("Describe el problema (mínimo 10 caracteres).");
    if (!authToken) return setMessage("No autorizado. Inicia sesión e intenta de nuevo.");

    setLoading(true);

    try {
      const payload: any = { order_id: Number(orderId), description: description.trim() };
      // si tu backend acepta attachment en JSON, incluirlo; si no, dejar file null y enviar sin él
      if (file) {
        // convertir a base64 solo si el backend lo espera
        const toBase64 = (f: File) =>
          new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onerror = rej;
            r.onload = () => {
              const s = String(r.result || "");
              const comma = s.indexOf(",");
              res(comma >= 0 ? s.slice(comma + 1) : s);
            };
            r.readAsDataURL(f);
          });
        const dataBase64 = await toBase64(file);
        payload.attachment = { filename: file.name, content_type: file.type, data_base64: dataBase64 };
      }

      const url = `${API_BASE_URL}/support/incidents`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = json?.detail || json?.message || "Error creando incidencia";
        throw new Error(err);
      }
      setMessage(`Incidencia creada: ${json.reference || json.id}`);
      setOrderId("");
      setDescription("");
      setFile(null);
    } catch (err: any) {
      setMessage(err?.message || "Error desconocido");
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
          <input type="number" value={orderId ?? ""} onChange={(e) => setOrderId(e.target.value === "" ? "" : Number(e.target.value))} required className="mt-1" />
        </label>

        <label>
          Descripción
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="mt-1" minLength={10} />
        </label>

        <label>
          Evidencia (opcional, se convertirá a base64 si el backend lo espera)
          <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1" />
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
