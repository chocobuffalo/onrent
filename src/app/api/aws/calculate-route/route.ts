import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { origin, destination, travelMode = "Car" } = await req.json();

    if (!origin || !destination) {
      return NextResponse.json({ error: "Missing origin or destination" }, { status: 400 });
    }

    const region = process.env.AWS_REGION || "us-east-2";
    const apiKey = process.env.AWS_KEY!;
    const calculatorName = process.env.AWS_ROUTE_CALCULATOR_NAME!;

    const awsRes = await fetch(`https://routes.geo.${region}.amazonaws.com/calculateroute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey
      },
      body: JSON.stringify({
        CalculatorName: calculatorName,
        DeparturePosition: origin,
        DestinationPosition: destination,
        TravelMode: travelMode
      })
    });

    const data = await awsRes.json();
    const routeLine = data.Route?.Geometry?.LineString || [];

    return NextResponse.json({ route: routeLine });

  } catch (error) {
    console.error("Error calculating route:", error);
    return NextResponse.json({ error: "Failed to calculate route" }, { status: 500 });
  }
}
