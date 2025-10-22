import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/generate-referral`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Error FastAPI: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error en proxy generate-referral:", err);
    return NextResponse.json({ error: "No se pudo generar referral" }, { status: 500 });
  }
}
