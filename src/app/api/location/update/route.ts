// src/app/api/location/update/route.ts
import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📥 Received location update request:", body);

    const { deviceId, latitude, longitude, timestamp, accuracy, altitude, heading, speed } = body;

    // Validación de campos requeridos
    if (!deviceId || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
      console.error("❌ Missing required fields:", { deviceId, latitude, longitude });
      return NextResponse.json({ 
        error: "Missing required fields: deviceId, latitude, longitude" 
      }, { status: 400 });
    }

    // Validación de coordenadas
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      console.error("❌ Invalid coordinate types:", { latitude: typeof latitude, longitude: typeof longitude });
      return NextResponse.json({ 
        error: "Latitude and longitude must be numbers" 
      }, { status: 400 });
    }

    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      console.error("❌ Invalid coordinate ranges:", { latitude, longitude });
      return NextResponse.json({ 
        error: "Invalid coordinate ranges. Lat: -90 to 90, Lng: -180 to 180" 
      }, { status: 400 });
    }

    // Crear registro de ubicación con estructura mejorada
    const locationRecord = {
      entity_id: deviceId,                    // ✅ Clave primaria
      entity_type: "maquinaria",              // ✅ Tipo por defecto, se puede parametrizar
      timestamp: timestamp || new Date().toISOString(),
      location: {                             // ✅ Nested como estructura original
        latitude: latitude,
        longitude: longitude
      },
      status: "active",                       // ✅ Estado por defecto
      // Metadatos adicionales del GPS
      ...(accuracy && { accuracy: accuracy }),
      ...(altitude !== null && altitude !== undefined && { altitude: altitude }),
      ...(heading !== null && heading !== undefined && { heading: heading }),
      ...(speed !== null && speed !== undefined && { speed: speed }),
      // Metadatos del sistema
      updated_at: new Date().toISOString(),
      source: "web_app"
    };

    console.log("📝 Location record to save:", locationRecord);

    // Guardar en DynamoDB
    const params = {
      TableName: process.env.DYNAMODB_LOCATION_TABLE_NAME,
      Item: locationRecord,
    };

    const command = new PutCommand(params);
    await docClient.send(command);

    console.log(`✅ Location updated for device ${deviceId} and saved to DynamoDB`);

    // Respuesta exitosa con información útil
    const response = {
      message: "Location updated successfully",
      device_id: deviceId,
      coordinates: {
        latitude: latitude,
        longitude: longitude
      },
      timestamp: locationRecord.timestamp,
      status: "saved"
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("❌ Error processing location update:", error);
    
    // Manejo de errores específicos
    if (error instanceof SyntaxError) {
      return NextResponse.json({ 
        error: "Invalid JSON format" 
      }, { status: 400 });
    }
    
    if (error instanceof TypeError) {
      return NextResponse.json({ 
        error: "Invalid data types in request" 
      }, { status: 422 });
    }

    return NextResponse.json({ 
      error: "Internal Server Error",
      message: "Failed to save location data"
    }, { status: 500 });
  }
}

// Manejar método OPTIONS para CORS si es necesario
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}