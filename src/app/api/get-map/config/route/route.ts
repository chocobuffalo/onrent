import { NextResponse } from "next/server";

export async function GET() {
  try {
    const region = process.env.AWS_REGION || 'us-east-2';
    const mapName = process.env.AWS_MAP_NAME || 'Ubicacion_obra';
    const apiKey = process.env.AWS_KEY

    if (!apiKey) {
      console.error('Missing AWS API key');
      return NextResponse.json(
        { error: "Missing AWS API key" },
        { status: 500 }
      );
    }

    const style = `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`;

    return NextResponse.json({
      style,
      region,
      mapName
    });

  } catch (error) {
    console.error('Error in map config API:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
