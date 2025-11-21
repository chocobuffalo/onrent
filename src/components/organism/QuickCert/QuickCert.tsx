"use client";
import React, { useState } from "react";

interface QuickCertProps {
  machineId: number;
  token?: string;
  onCreated?: (r: { request_id: number; public_url?: string }) => void;
  maxSizeBytes?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_ORIGIN || "";

const QuickCert = ({ machineId, token, onCreated, maxSizeBytes = 500 * 1024 * 1024 }: QuickCertProps) => {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [level, setLevel] = useState("black");
  const [busy, setBusy] = useState(false);

  const getAuth = () => token || (typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "");

  const validateUrl = (u: string) => {
    try {
      const p = new URL(u);
      return p.protocol === "http:" || p.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (busy) return;
    const auth = getAuth();
    if (!auth) return alert("Falta token de sesión.");

    try {
      setBusy(true);
      let public_url = "";

      if (mode === "upload") {
        if (!file) return alert("Selecciona un archivo.");
        if (file.size > maxSizeBytes) return alert("Archivo demasiado grande.");
        const r = await fetch(`${API_BASE_URL}/api/machinery/certification/get_upload_url`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth}` },
          body: JSON.stringify({ filename: file.name, mime_type: file.type, machine_id: machineId }),
        });
        if (!r.ok) throw new Error("No se obtuvo URL de subida");
        const j = await r.json();
        public_url = j.public_url;
        // PUT upload
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", j.upload_url);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
          xhr.onerror = () => reject(new Error("Upload network error"));
          xhr.send(file);
        });
      } else {
        if (!url) return alert("Pega una URL pública.");
        if (!validateUrl(url)) return alert("URL inválida.");
        public_url = url;
      }

      const s = await fetch(`${API_BASE_URL}/api/machinery/certification/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth}` },
        body: JSON.stringify({ machine_id: machineId, requested_level: level, video_url: public_url }),
      });
      if (!s.ok) {
        const t = await s.text().catch(() => "");
        throw new Error(t || "Submit failed");
      }
      const res = await s.json();
      if (typeof onCreated === "function") onCreated({ request_id: res.request_id, public_url });
      alert(`Solicitud creada (request_id=${res.request_id})`);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="quick-cert">
      <div className="mode">
        <button type="button" onClick={() => setMode("upload")} className={mode === "upload" ? "active" : ""}>Subir</button>
        <button type="button" onClick={() => setMode("url")} className={mode === "url" ? "active" : ""}>Usar URL</button>
      </div>

      <div className="controls">
        <div className="mb-2">
          <label>Nivel solicitado</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="basic">Basic</option>
            <option value="standard">Standard</option>
            <option value="black">Black</option>
          </select>
        </div>

        {mode === "upload" ? (
          <div className="mb-2">
            <input id="qc-file" type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        ) : (
          <div className="mb-2">
            <input type="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
        )}

        <div>
          <button className="pre-btn" disabled={busy} onClick={handleSubmit}>
            {busy ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickCert;
