"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type WhatsAppWidgetProps = {
  phone?: string; // E.164 sin '+', p.ej. 524443427046 (tu número de negocio)
  brand?: string; // Encabezado del popup
  greeting?: string; // Subtítulo/emoción
  defaultMessage?: string; // Mensaje inicial
  supportHours?: string; // Horario informativo
  avatarSrc?: string; // Logo en header del popup
  logoSrc?: string; // ✅ Logo que será el botón flotante
};

function normBusinessPhoneE164(businessNo?: string) {
  // Convierte "524443427046" => "+524443427046"; si ya trae + lo deja
  if (!businessNo) return "";
  const trimmed = String(businessNo).trim();
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

function normUserPhoneE164(input: string) {
  // Limpia todo menos dígitos y +; si no hay + asumimos MX (52)
  const raw = input.replace(/[^\d+]/g, "");
  if (raw.startsWith("+")) return raw;
  // Puedes ajustar este supuesto de país si quieres: 52 = MX
  if (/^\d{10,15}$/.test(raw)) return `+52${raw}`;
  return raw; // deja lo que escribió para validarlo en servidor si aplica
}

export default function WhatsAppWidget({
  phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  brand = "OnRentX",
  greeting = "¡Hola! 👋 ¿En qué podemos ayudarte?",
  defaultMessage = "Hola, me gustaría más información.",
  supportHours = "L–V 9:00–18:00 (CST)",
  avatarSrc = "/Whatsapp-Logo.png",
  logoSrc = "/Whatsapp-Logo.png",
}: WhatsAppWidgetProps) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(defaultMessage);
  const [userPhone, setUserPhone] = useState(""); // teléfono del visitante (para WASender)
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);
  const [errorMsg, setErrorMsg] = useState("");

  const businessE164 = normBusinessPhoneE164(phone);

  const waHref = useMemo(() => {
    const page =
      typeof window !== "undefined"
        ? `\n\nPágina: ${window.location.href}`
        : "";
    const text = `${msg}${page}`;
    // API oficial de "click to chat"
    // Usamos "phone=" con E.164 SIN '+' (requisito de ese endpoint)
    const noPlus = businessE164.replace(/^\+/, "");
    return `https://api.whatsapp.com/send?phone=${encodeURIComponent(
      noPlus
    )}&text=${encodeURIComponent(text)}`;
  }, [msg, businessE164]);

  const quicks = [
    "Quiero cotizar una máquina",
    "Tengo una duda sobre una renta",
    "Soporte técnico del sitio",
    "Factura y métodos de pago",
  ];

  const canSendViaWasender =
    userPhone.trim().length >= 8 && msg.trim().length > 0;

  async function sendViaWasender() {
    try {
      setSending(true);
      setSent(null);
      setErrorMsg("");

      const page =
        typeof window !== "undefined"
          ? `\n\nPágina: ${window.location.href}`
          : "";
      const text = `${msg}${page}`;

      const to = normUserPhoneE164(userPhone);

      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, text }),
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
          className="
            mb-3 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl
            transition-all duration-200 ease-out
          "
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
            {/* Atajos rápidos */}
            <div className="flex flex-wrap gap-2">
              {quicks.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setMsg(q)}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-200 hover:bg-gray-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <label className="block text-xs text-gray-600">
              Mensaje
              <textarea
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-[#25D366]/50"
                rows={3}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Escribe tu mensaje…"
              />
            </label>

            {/* Campo para WASender (número del visitante) */}
            <label className="block text-xs text-gray-600">
              Tu número de WhatsApp (para recibir el mensaje)
              <input
                type="tel"
                inputMode="tel"
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-[#25D366]/50"
                placeholder="+52 444 123 4567"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
            </label>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-2">
              {/* Abrir WhatsApp nativo (clásico) */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl px-4 py-2 text-sm font-semibold
                  bg-[#25D366] text-white hover:brightness-95 active:brightness-90
                "
              >
                Abrir WhatsApp
              </a>

              {/* Enviarlo a su WhatsApp usando WASenderAPI */}
              <button
                type="button"
                disabled={!canSendViaWasender || sending}
                onClick={sendViaWasender}
                className={`
                  inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold
                  ${
                    sending
                      ? "bg-gray-300 text-gray-600"
                      : "bg-black text-white hover:opacity-90"
                  }
                  disabled:opacity-50
                `}
              >
                {sending ? "Enviando..." : "Recibir por WhatsApp"}
              </button>

              {sent === "ok" && (
                <p className="text-xs text-green-600">
                  ✅ Mensaje enviado a tu WhatsApp.
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

      {/* FAB: el botón ES TU LOGO */}
      <button
        aria-label="Abrir chat de WhatsApp"
        onClick={() => setOpen((v) => !v)}
        className="
          relative h-16 w-16 rounded-full shadow-xl overflow-hidden
          focus:outline-none focus:ring-4 focus:ring-[#25D366]/30
          p-1.5
        "
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
