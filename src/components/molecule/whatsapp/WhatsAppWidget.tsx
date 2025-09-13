"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type WhatsAppWidgetProps = {
  phone?: string; // E.164 sin '+', ej. 524443427046 (tu número de negocio)
  brand?: string;
  greeting?: string;
  supportHours?: string;
  avatarSrc?: string; // Logo header
  logoSrc?: string; // Logo botón flotante
};

function normBusinessPhoneE164(businessNo?: string) {
  if (!businessNo) return "";
  const trimmed = String(businessNo).trim();
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

function normUserPhoneE164(input: string) {
  const raw = input.replace(/[^\d+]/g, "");
  if (raw.startsWith("+")) return raw;
  if (/^\d{10,15}$/.test(raw)) return `+52${raw}`; // asume MX si no trae +
  return raw;
}

/** 🔒 Plantillas visibles para el usuario (INBOUND/Click-to-chat)
 *  Se envían DESDE el usuario HACIA tu número al abrir WhatsApp.
 *  No hay texto libre: solo elegimos un topic.
 */
const INBOUND_TEMPLATES: Record<string, string> = {
  quote:
    "Hola, me interesa cotizar una máquina.\n• Equipo requerido: ____\n• Fechas estimadas: ____\n• Ubicación/ciudad: ____\n• ¿Con operador? ____",
  rent: "Hola, tengo una duda sobre mi renta.\n• Folio/Referencia (si aplica): ____\n• Máquina: ____\n• Descripción del detalle: ____",
  support:
    "Hola, necesito soporte del sitio.\n• ¿Qué intentabas hacer?: ____\n• Mensaje de error (si aparece): ____\n• Dispositivo/Navegador: ____",
  billing:
    "Hola, quiero factura.\n• RFC: ____\n• Razón social: ____\n• Uso de CFDI: ____\n• Correo de envío: ____",
};

export default function WhatsAppWidget({
  phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  brand = "OnRentX",
  greeting = "¡Hola! 👋 ¿En qué podemos ayudarte?",
  supportHours = "L–V 9:00–18:00 (CST)",
  avatarSrc = "/Whatsapp-Logo.png",
  logoSrc = "/Whatsapp-Logo.png",
}: WhatsAppWidgetProps) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<keyof typeof INBOUND_TEMPLATES>("quote");

  // contacto proactivo (tú les escribes)
  const [userPhone, setUserPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);
  const [errorMsg, setErrorMsg] = useState("");

  const businessE164 = normBusinessPhoneE164(phone);

  // Abrir WhatsApp con plantilla INBOUND (sin URL de la página)
  const waHref = useMemo(() => {
    const text = INBOUND_TEMPLATES[topic];
    const noPlus = businessE164.replace(/^\+/, "");
    return `https://api.whatsapp.com/send?phone=${encodeURIComponent(
      noPlus
    )}&text=${encodeURIComponent(text)}`;
  }, [topic, businessE164]);

  const canSend = userPhone.trim().length >= 8 && consent;

  async function sendViaWasender() {
    try {
      setSending(true);
      setSent(null);
      setErrorMsg("");

      const to = normUserPhoneE164(userPhone);

      // Enviamos SOLO el topic; el servidor arma el texto (OUTBOUND) y NO incluye URL.
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, topic }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setSent("err");
        setErrorMsg(data?.error || "No se pudo enviar el mensaje.");
      } else {
        setSent("ok");
      }
    } catch (e: any) {
      setSent("err");
      setErrorMsg(e?.message || "Error inesperado.");
    } finally {
      setSending(false);
    }
  }

  if (!phone) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[1000] select-none">
      {/* POPUP */}
      {open && (
        <div
          className="mb-3 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl transition-all duration-200 ease-out"
          style={{ transformOrigin: "bottom right" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-[#25D366] text-white rounded-t-2xl">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white">
              <Image
                src={avatarSrc}
                alt={`${brand} avatar`}
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{brand}</p>
              <p className="text-xs opacity-95 truncate">{greeting}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            {/* Plantillas (chips) */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "quote", label: "Cotización" },
                { id: "rent", label: "Duda de renta" },
                { id: "support", label: "Soporte del sitio" },
                { id: "billing", label: "Facturación" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTopic(id as keyof typeof INBOUND_TEMPLATES)}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    topic === id
                      ? "border-[#25D366] bg-[#25D366]/10"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Acciones */}
            <div className="grid gap-2">
              {/* Abrir WhatsApp nativo (solo plantilla, sin URL) */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-[#25D366] text-white hover:brightness-95 active:brightness-90"
              >
                Abrir WhatsApp ahora
              </a>

              <div className="h-px bg-gray-200 my-1" />

              {/* Que tú les escribas (WASender) */}
              <label className="block text-xs text-gray-700">
                Tu WhatsApp (para que te contactemos)
                <input
                  type="tel"
                  inputMode="tel"
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-[#25D366]/50"
                  placeholder="+52 444 123 4567"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                Acepto que me contacten por WhatsApp según la política de
                privacidad.
              </label>

              <button
                type="button"
                disabled={!canSend || sending}
                onClick={sendViaWasender}
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold ${
                  sending
                    ? "bg-gray-300 text-gray-600"
                    : "bg-black text-white hover:opacity-90"
                } disabled:opacity-50`}
              >
                {sending ? "Enviando…" : "Que me escriban por WhatsApp"}
              </button>

              {sent === "ok" && (
                <p className="text-xs text-green-600">
                  ✅ Te contactaremos por WhatsApp.
                </p>
              )}
              {sent === "err" && (
                <p className="text-xs text-red-600">❌ {errorMsg}</p>
              )}
            </div>

            <p className="text-[11px] text-gray-500">{supportHours}</p>
          </div>
        </div>
      )}

      {/* FAB: botón = tu logo */}
      <button
        aria-label="Abrir chat de WhatsApp"
        onClick={() => setOpen((v) => !v)}
        className="relative h-16 w-16 rounded-full shadow-xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 p-1.5 bg-white"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
        title="Chatea con nosotros"
      >
        <Image
          src={logoSrc}
          alt="WhatsApp / Soporte"
          fill
          sizes="64px"
          className="object-contain"
          priority
        />
      </button>
    </div>
  );
}
