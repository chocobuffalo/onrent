// src/app/api/orders/[orderId]/destination/route.ts
import { NextRequest, NextResponse } from "next/server";

interface OrderDestination {
  latitude: number;
  longitude: number;
  address: string;
  order_id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Aquí conectarías con tu base de datos o API de Odoo para obtener la dirección de la obra
    // Por ahora simulo una respuesta basada en datos típicos
    
    // Simulación de consulta a base de datos/Odoo
    const mockDestinations: Record<string, OrderDestination> = {
      "1": {
        latitude: 19.4326,
        longitude: -99.1332,
        address: "Av. Paseo de la Reforma 123, Cuauhtémoc, CDMX",
        order_id: "1"
      },
      "2": {
        latitude: 20.6596,
        longitude: -103.3496,
        address: "Av. Vallarta 456, Guadalajara, Jalisco",
        order_id: "2"
      },
      "38": {
        latitude: 25.6866,
        longitude: -100.3161,
        address: "Av. Constitución 789, Monterrey, Nuevo León",
        order_id: "38"
      }
    };

    const destination = mockDestinations[orderId];

    if (!destination) {
      return NextResponse.json(
        { error: `No destination found for order ${orderId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      destination
    });

  } catch (error) {
    console.error("Error fetching order destination:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}