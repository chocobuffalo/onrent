// src/app/api/get-map/route/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  LocationClient,
  CalculateRouteCommand,
  CalculateRouteCommandInput,
  TravelMode, 
  DistanceUnit, 
} from "@aws-sdk/client-location";

const AWS_REGION = process.env.AWS_REGION || "us-east-2";
// Se corrige la variable para que coincida con la del archivo .env
const ROUTE_CALCULATOR_NAME = process.env.AWS_ROUTE_CALCULATOR_NAME; 

const locationClient = new LocationClient({ region: AWS_REGION });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }
    
    // Se valida que el nombre del calculador exista antes de usarlo.
    if (!ROUTE_CALCULATOR_NAME) {
      return NextResponse.json(
        { error: "La variable de entorno AWS_MAP_NAME no está configurada." },
        { status: 500 }
      );
    }

    const input: CalculateRouteCommandInput = {
      CalculatorName: ROUTE_CALCULATOR_NAME,
      DeparturePosition: [origin.lng, origin.lat],
      DestinationPosition: [destination.lng, destination.lat],
      TravelMode: "Car" as TravelMode, 
      DistanceUnit: "Kilometers" as DistanceUnit, 
      IncludeLegGeometry: true,
    };

    const command = new CalculateRouteCommand(input);
    const awsResponse = await locationClient.send(command);

    if (!awsResponse.Legs || awsResponse.Legs.length === 0) {
      return NextResponse.json(
        { error: "No se pudo calcular la ruta." },
        { status: 404 }
      );
    }

    return NextResponse.json(awsResponse);
  } catch (err) {
    console.error("Error al calcular la ruta:", err);
    return NextResponse.json(
      { error: "Failed to calculate route" },
      { status: 500 }
    );
  }
}