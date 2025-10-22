import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const partner_id = searchParams.get("partner_id");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/referrals?partner_id=${partner_id}`);

    if (!res.ok) {
      throw new Error(`Error FastAPI: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error en proxy referrals:", err);
    return NextResponse.json({ error: "No se pudo obtener referidos" }, { status: 500 });
  }
}
