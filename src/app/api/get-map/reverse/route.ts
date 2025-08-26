import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let lat: number | undefined;
  let lng: number | undefined;

  try {
    const body = await request.json();
    lat = body.lat;
    lng = body.lng;

    if (!lat || !lng || typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json(
        { error: "Valid lat and lng are required" },
        { status: 400 }
      );
    }

    // Usar Nominatim para geocodificación inversa
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: { 'User-Agent': process.env.NOMINATIM_USER_AGENT || 'OnRentX/1.0' }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      });
    }

    return NextResponse.json({
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    });

  } catch (error) {
    console.error('Reverse geocoding API error:', error);

    // Fallback address usando las coordenadas parseadas o coordenadas por defecto
    const fallbackAddress = (lat !== undefined && lng !== undefined)
      ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      : 'Unknown location';

    return NextResponse.json({
      error: 'Internal server error',
      address: fallbackAddress
    }, { status: 500 });
  }
}
