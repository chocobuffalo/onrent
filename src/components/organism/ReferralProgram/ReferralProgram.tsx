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
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = session?.user?.access_token;
    if (!token) return;

    const fetchData = async () => {
      try {
        const linkData = await generateReferral(token);
        setReferralLink(linkData.referral_link);
        setQrImage(linkData.qr_image_base64);
        setLoyaltyPoints(linkData.loyalty_points);

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
          marginBottom: '24px',
          color: '#1f2937'
        }}
      >
        Programa de Lealtad - Referidos
      </h2>

      {/* 👇 Badge con color exacto del sistema #EA6300 (--color-secondary) */}
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: '#FF7101',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(234, 99, 0, 0.25)'
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: '500', marginRight: '8px' }}>
          🎁 Tus puntos de lealtad:
        </span>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
          {loyaltyPoints}
        </span>
      </div>

      {/* 👇 Texto motivacional con acento naranja #EA6300 */}
      <p 
        style={{ 
          fontSize: '20px', 
          fontWeight: '500', 
          color: '#4b5563',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}
      >
        ¡Comparte tu código de referido para <span style={{ color: '#EA6300' }}>ganar puntos</span> que podrás canjear por premios o dinero real!
      </p>

      <input
        value={referralLink}
        readOnly
        className="border p-2 w-full mb-4"
        style={{
          borderRadius: '8px',
          borderColor: '#d1d5db',
          padding: '12px',
          fontSize: '14px',
          color: '#6b7280'
        }}
      />

      <div className="mb-6">
        {qrImage ? (
          <img 
            src={`data:image/png;base64,${qrImage}`} 
            alt="QR" 
            style={{ maxWidth: '200px', height: 'auto' }}
          />
        ) : (
          referralLink && <QRCode value={referralLink} size={128} />
        )}
      </div>

      {/* Tabla de referidos */}
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
