"use client";
import React, { useState } from "react";
import { ImSpinner8 } from "react-icons/im";

type Mode = "upload" | "url";

interface Props {
  machineId: number;
  token: string;
  onSubmit?: (payload: { machineId: number; videoUrl: string }) => Promise<void>;
}

const CertificationUploader = ({ machineId, token, onSubmit }: Props) => {
  const [mode, setMode] = useState<Mode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (busy) return;
    setBusy(true);
    try {
      let videoUrl = "";
      if (mode === "upload") {
        if (!file) return setMessage("Selecciona un archivo de video");
        // aquí iría tu lógica real de upload → obtener public_url
        videoUrl = file.name; // placeholder
      } else {
        if (!url) return setMessage("Coloca una URL válida");
        videoUrl = url;
      }
      if (onSubmit) {
        await onSubmit({ machineId, videoUrl });
      }
      setMessage("✅ Enviado correctamente");
    } catch (e: any) {
      setMessage("❌ Error: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="cert-uploader card">
      <div className="card-body">
        <div className="mode-switch mb-3">
          <label>
            <input
              type="radio"
              checked={mode === "upload"}
              onChange={() => setMode("upload")}
            />{" "}
            Subir archivo
          </label>
          <label className="ms-3">
            <input
              type="radio"
              checked={mode === "url"}
              onChange={() => setMode("url")}
            />{" "}
            Usar URL
          </label>
        </div>

        {mode === "upload" ? (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="form-control mb-3"
          />
        ) : (
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="form-control mb-3"
          />
        )}

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={busy}
        >
          {busy ? <ImSpinner8 className="animate-spin" /> : "Enviar"}
        </button>

        {message && <p className="mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default CertificationUploader;
