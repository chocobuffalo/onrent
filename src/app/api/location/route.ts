// src/app/api/location/route.ts

import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

/**
 * Cliente para interactuar con la base de datos DynamoDB.
 * Las credenciales y la región se obtienen automáticamente del entorno.
 */
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Manejador de ruta para las actualizaciones de ubicación.
 * @param request La solicitud HTTP entrante, contiene los datos de ubicación del operador.
 * @returns Una respuesta JSON que indica el estado de la operación.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceId, latitude, longitude } = body;

    // Validación de los datos de la petición
    if (!deviceId || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
      return NextResponse.json({ error: "Missing deviceId, latitude, or longitude" }, { status: 400 });
    }

    // Objeto que representa el registro de ubicación en DynamoDB
    const locationRecord = {
      // El 'deviceId' es la clave principal de la tabla para identificar al operador/maquinaria.
      entity_id: deviceId,
      entity_type: "maquinaria", 
      // La marca de tiempo es útil para rastrear el historial de ubicaciones.
      timestamp: new Date().toISOString(),
      location: {
        latitude: latitude,
        longitude: longitude
      },
      // Puedes añadir más atributos como el estado de la batería, velocidad, etc.
    };

    // Parámetros para el comando 'PutCommand'
    const params = {
      TableName: process.env.DYNAMODB_LOCATION_TABLE_NAME, // Nombre de la tabla de DynamoDB
      Item: locationRecord,
    };

    // Guardar el registro en DynamoDB
    const command = new PutCommand(params);
    await docClient.send(command);

    console.log(`Location updated for device ${deviceId} and saved to DynamoDB.`);

    return NextResponse.json({ message: "Location updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing location update:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}