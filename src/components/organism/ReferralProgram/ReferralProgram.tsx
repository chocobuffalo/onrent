"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ImSpinner8 } from "react-icons/im";
import QRCode from "react-qr-code";
import { getReferrals, generateReferral } from "@/services/referrals";
import { Referral } from "@/types/referral";
import DynamicTable from "@/components/atoms/DynamicTable/DynamicTable";

export default function ReferralProgram() {
  const { data: session, status } = useSession();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralLink, setReferralLink] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = session?.user?.access_token;
    if (!token) return;

    const fetchData = async () => {
      try {
        const linkData = await generateReferral(token);
        setReferralLink(linkData.referral_link);
        setQrImage(linkData.qr_image_base64);

        const data = await getReferrals(token);
        setReferrals(data);
      } catch (err) {
        console.error("Error cargando referidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.access_token]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <ImSpinner8 className="animate-spin text-2xl" />
      </div>
    );
  }

  if (!session?.user?.access_token) {
    return <p>No hay sesión activa</p>;
  }

  //  Definimos columnas para la tabla de referidos
  const columns = [
    { key: "name", label: "Nombre" },
    { key: "commission_amount", label: "Comisión" },
    { key: "points", label: "Puntos" },
    {
      key: "registered_at",
      label: "Fecha de comisión",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
  ];

  return (
    <div className="container p-4">
      <h2 
        style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '24px' 
        }}
      >
        Programa de Lealtad - Referidos
      </h2>
<p 
  style={{ 
    fontSize: '20px', 
    fontWeight: '500',
    marginBottom: '32px',
    lineHeight: '1.6'
  }}
>
  ¡Comparte tu código de referido para <span style={{ color: '#f97316' }}>ganar puntos</span> que podrás canjear
  por premios o dinero real!
</p>


      <input
        value={referralLink}
        readOnly
        className="border p-2 w-full mb-4"
      />

      <div className="mb-6">
        {qrImage ? (
          <img src={`data:image/png;base64,${qrImage}`} alt="QR" />
        ) : (
          referralLink && <QRCode value={referralLink} size={128} />
        )}
      </div>

      {/* Tabla de referidos usando DynamicTable */}
      <div className="mt-6">
        <DynamicTable
          title="Lista de Referidos"
          items={referrals}
          isLoading={loading}
          error={null}
          searchValue={""}
          columns={columns}
          actionButtons={[]}
        />
      </div>
    </div>
  );
}
