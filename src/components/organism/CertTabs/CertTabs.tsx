"use client";
import React, { useState } from "react";
import QuickCert from "@/components/organism/QuickCert/QuickCert";
import CertificationUploader from "@/components/organism/CertificationUploader/CertificationUploader";

interface CertTabsProps {
  machineId: number;
  token?: string;
  onCreated?: (r: { request_id: number; public_url?: string }) => void;
}

const CertTabs = ({ machineId, token, onCreated }: CertTabsProps) => {
  const [tab, setTab] = useState<"quick" | "full">("full");

  return (
    <div className="cert-tabs card">
      <div className="card-body">
        {/* Encabezado y descripción */}
        <h5 className="mb-2 fw-bold">Certifica tu maquinaria</h5>
        <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
          La maquinaria certificada recibe una etiqueta distintiva y prioridad en el algoritmo de asignación de rentas. (Video máx. 500MB)
        </p>

        
        {/* Contenido de pestañas */}
        <div className="cert-tabs__body border-top pt-3">
          {tab === "full" ? (
            <CertificationUploader machineId={machineId} token={token || ""} />
          ) : (
            <QuickCert machineId={machineId} token={token} onCreated={onCreated} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CertTabs;
