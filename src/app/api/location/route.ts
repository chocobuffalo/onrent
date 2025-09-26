// src/app/api/location/route.ts

import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceId, latitude, longitude } = body;

    if (!deviceId || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
      return NextResponse.json({ error: "Missing deviceId, latitude, or longitude" }, { status: 400 });
    }

    // ✅ Mantener tu estructura original con entity_id como clave
    const locationRecord = {
      entity_id: deviceId,           // ✅ Clave primaria
      entity_type: "maquinaria", 
      timestamp: new Date().toISOString(),
      location: {                    // ✅ Nested como tenías originalmente
        latitude: latitude,
        longitude: longitude
      },
    };

    const params = {
      TableName: process.env.DYNAMODB_LOCATION_TABLE_NAME,
      Item: locationRecord,
    };

    const command = new PutCommand(params);
    await docClient.send(command);

    console.log(`Location updated for device ${deviceId} and saved to DynamoDB.`);

    return NextResponse.json({ message: "Location updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing location update:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


