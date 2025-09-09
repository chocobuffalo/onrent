import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint POST que calcula la ruta entre un origen y un destino usando AWS Location Service
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination } = body;

    // Validación de datos
    if (!origin || !destination) {
      return NextResponse.json({ error: "Origin and destination are required" }, { status: 400 });
    }

    // Llamada al API de AWS Location Service (CalculateRoutes)
    const res = await fetch(
      `https://routes.geo.${process.env.AWS_REGION}.amazonaws.com/routes/v0/calculators/${process.env.AWS_MAP_NAME}/calculateRoute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.AWS_KEY || "",
        },
        body: JSON.stringify({
          DeparturePosition: [origin.lng, origin.lat],      // Formato [lng, lat]
          DestinationPosition: [destination.lng, destination.lat],
          TravelMode: "Car",                                // Modo de viaje
          IncludeLegGeometry: true,                         // Devuelve coordenadas de la línea de ruta
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Failed to calculate route" }, { status: res.status });
    }

    const data = await res.json();

    // Devuelve datos de la ruta al frontend
    return NextResponse.json(data);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to calculate route" }, { status: 500 });
  }
}
