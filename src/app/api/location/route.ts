import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceId, latitude, longitude } = body;

    if (!deviceId || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
      return NextResponse.json({ error: "Missing deviceId, latitude, or longitude" }, { status: 400 });
    }

    // In a real application, you would save this data to a database
    // or a real-time tracking system.
    console.log(`Received location update for device ${deviceId}: Lat ${latitude}, Lng ${longitude}`);

    return NextResponse.json({ message: "Location updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing location update:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}