"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import "@/components/organism/Support/support.scss";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_ORIGIN || "";

export default function OperatorIncidentForm({ transferId }: { transferId?: number }) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken || (session as any)?.access_token || "";

  const [incidentType, setIncidentType] = useState("mechanical");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    console.debug("[Support][OperatorIncidentForm] submit start", { transferId, incidentType, description, photo });

    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "");
    if (!authToken) {
      setMessage("No autorizado");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      if (transferId) fd.append("transfer_id", String(transferId));
      fd.append("incident_type", incidentType);
      fd.append("description", description || "");
      if (photo) fd.append("photo", photo);

      const url = `${API_BASE_URL}/support/operator_incidents`;
      console.debug("[Support][OperatorIncidentForm] POST URL:", url);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: fd,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("[Support][OperatorIncidentForm] server error body", json);
        const err = json?.detail || "Error creando incidencia de operador";
        throw new Error(err);
      }

      setMessage(`Incidencia de operador creada: ${json.reference || json.id}`);
      setDescription("");
      setPhoto(null);
    } catch (err: any) {
      console.error("[Support][OperatorIncidentForm] submit error", err);
      setMessage(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support__panel">
      <h3 className="support__panel-title">Incidencia de operador</h3>
      <form onSubmit={submit} className="support__panel-form" noValidate>
        <label>
          Tipo de incidencia
          <select value={incidentType} onChange={(e) => setIncidentType(e.target.value)} className="mt-1">
            <option value="mechanical">Falla mecánica</option>
            <option value="danger">Condición peligrosa</option>
            <option value="access">Problema de acceso</option>
            <option value="conflict">Conflicto en sitio</option>
          </select>
        </label>

        <label>
          Descripción
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1" />
        </label>

        <label>
          Foto (opcional)
          <input type="file" accept="image/*,application/pdf" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} className="mt-1" />
        </label>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar incidente de operador"}
          </button>
          {message && <div className="text-sm" style={{ color: "#374151" }}>{message}</div>}
        </div>
      </form>
    </div>
  );
}
