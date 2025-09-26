// src/app/api/location/get-location/route.ts

import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const deviceId = url.searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json({ error: "Missing deviceId parameter" }, { status: 400 });
    }

    // Usar Scan con filtro ya que la clave primaria no está clara
    const params = {
      TableName: process.env.DYNAMODB_LOCATION_TABLE_NAME,
      FilterExpression: "entity_id = :deviceId",
      ExpressionAttributeValues: {
        ":deviceId": deviceId,
      },
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return NextResponse.json({ error: "Device not found or no location recorded" }, { status: 404 });
    }

    // Tomar el primer item encontrado
    const item = result.Items[0];

    // Adaptar la respuesta a la estructura real de tu tabla
    return NextResponse.json({
      location: {
        latitude: item.location?.latitude || item.latitude,
        longitude: item.location?.longitude || item.longitude,
        timestamp: item.timestamp,
        deviceId: item.entity_id,
      }
    });
  } catch (error) {
    console.error("Error fetching device location:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



