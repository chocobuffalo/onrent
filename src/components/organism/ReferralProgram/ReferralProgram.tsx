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
      <h2 className="text-xl font-bold mb-2">Programa de Lealtad - Referidos</h2>
      <p>Tus puntos de lealtad: {loyaltyPoints}</p>

      <input
        value={referralLink}
        readOnly
        className="border p-2 w-full mb-2"
      />

      {qrImage ? (
        <img src={`data:image/png;base64,${qrImage}`} alt="QR" />
      ) : (
        referralLink && <QRCode value={referralLink} size={128} />
      )}

      {/* 👇 Leyenda motivadora */}
      <p className="mt-4 text-sm text-gray-600 text-center">
        ¡Comparte tu código de referido para ganar puntos que podrás canjear
        por premios o dinero real!
      </p>

      {/* Tabla de referidos usando DynamicTable */}
      <div className="mt-6">
        <DynamicTable
          title="Lista de Referidos"
          items={referrals}
          isLoading={loading}
          error={null}
          searchValue={""}
          columns={columns}
          actionButtons={[]} // sin botones de acción
        />
      </div>
    </div>
  );
}
