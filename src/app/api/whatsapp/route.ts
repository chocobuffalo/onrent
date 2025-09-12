import { NextResponse } from "next/server";

// Mensajes que TÚ les envías (OUTBOUND) vía WASender.
// Personaliza libremente el copy y firma.
const OUTBOUND_TEMPLATES: Record<string, string> = {
  quote:
    "¡Hola! Te saluda OnRentX 👷‍♂️\nGracias por tu interés en cotizar maquinaria. Para ayudarte mejor, compártenos:\n• Equipo requerido y cantidad\n• Fechas de uso\n• Ubicación/ciudad\n• ¿Con operador?\nQuedamos atentos para enviarte la cotización.",
  rent: "¡Hola! Equipo de OnRentX de soporte de rentas.\nVimos tu solicitud y queremos ayudarte. ¿Nos confirmas folio/referencia y el detalle del inconveniente?\nCon gusto te apoyamos.",
  support:
    "Hola, somos el equipo de OnRentX.\nRecibimos tu solicitud de soporte. Para agilizar, cuéntanos:\n• Qué estabas intentando hacer\n• Si te apareció algún mensaje de error\n• Dispositivo/navegador\nEstamos al pendiente.",
  billing:
    "Hola, facturación de OnRentX.\nPara generarte factura, por favor compártenos:\n• RFC y razón social\n• Uso de CFDI\n• Método de pago\n• Correo de envío\nGracias, te la enviamos en cuanto la generemos.",
};

const WASENDER_API_URL =
  process.env.WASENDER_API_URL || "https://wasenderapi.com/api/send-message";
const API_KEY = process.env.WASENDER_API_KEY;

// (Opcional) rate limit muy básico por IP
const hits: Record<string, { c: number; ts: number }> = {};
const WINDOW_MS = 60 * 1000;
const MAX_HITS = 5;

function rateLimit(ip: string) {
  const now = Date.now();
  const rec = hits[ip] || { c: 0, ts: now };
  if (now - rec.ts > WINDOW_MS) {
    hits[ip] = { c: 1, ts: now };
    return true;
  }
  rec.c += 1;
  rec.ts = now;
  hits[ip] = rec;
  return rec.c <= MAX_HITS;
}

export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Falta WASENDER_API_KEY" },
        { status: 500 }
      );
    }

    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0] || "unknown";
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Rate limit excedido" },
        { status: 429 }
      );
    }

    const { to, topic } = await req.json();

    if (!to || typeof to !== "string") {
      return NextResponse.json(
        { ok: false, error: "Parámetro 'to' inválido" },
        { status: 400 }
      );
    }
    if (!topic || typeof topic !== "string" || !OUTBOUND_TEMPLATES[topic]) {
      return NextResponse.json(
        { ok: false, error: "Plantilla no permitida" },
        { status: 400 }
      );
    }

    const text = OUTBOUND_TEMPLATES[topic]; // 👈 sin URL de la página

    const res = await fetch(WASENDER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, text }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: res.status,
          error: data?.message || "Error en WASenderAPI",
        },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Error inesperado" },
      { status: 500 }
    );
  }
}
