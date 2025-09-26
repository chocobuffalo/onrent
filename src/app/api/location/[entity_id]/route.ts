// src/app/api/location/[entity_id]/route.ts
import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET(
  request: Request,
  { params }: { params: { entity_id: string } }
) {
  try {
    const { entity_id } = params;

    if (!entity_id) {
      return NextResponse.json(
        { error: "Missing entity_id parameter" },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching location for entity_id: ${entity_id}`);

    const command = new GetCommand({
      TableName: process.env.DYNAMODB_LOCATION_TABLE_NAME,
      Key: {
        entity_id: entity_id,
      },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      console.log(`❌ No location found for entity_id: ${entity_id}`);
      return NextResponse.json(
        { 
          error: "Location not found", 
          message: `No location data available for device ${entity_id}` 
        },
        { status: 404 }
      );
    }

    console.log(`✅ Location found for ${entity_id}:`, response.Item);

    // Transformar datos para que coincidan con el formato esperado
    const locationData = {
      entity_id: response.Item.entity_id,
      entity_type: response.Item.entity_type || "maquinaria",
      timestamp: response.Item.timestamp,
      location: {
        latitude: response.Item.location?.latitude || 0,
        longitude: response.Item.location?.longitude || 0,
      },
      status: response.Item.status || "active",
    };

    // Validar que las coordenadas sean válidas
    if (!locationData.location.latitude || !locationData.location.longitude) {
      return NextResponse.json(
        { 
          error: "Invalid location data", 
          message: `Device ${entity_id} has invalid coordinates` 
        },
        { status: 422 }
      );
    }

    return NextResponse.json(locationData, { status: 200 });

  } catch (error) {
    console.error(`❌ Error fetching location for ${params.entity_id}:`, error);
    
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        message: "Failed to retrieve location data" 
      },
      { status: 500 }
    );
  }
}