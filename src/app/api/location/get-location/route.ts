// src/app/api/location/get-location/route.ts

import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

/**
 * Cliente para interactuar con la base de datos DynamoDB.
 * Las credenciales y la región se obtienen automáticamente del entorno.
 */
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Manejador de ruta para obtener la última ubicación de un dispositivo.
 * Esta API es utilizada por las vistas del cliente y del proveedor
 * para mostrar la ubicación de la maquinaria en el mapa.
 *
 * @param req La solicitud HTTP entrante, que contiene el ID del dispositivo en la URL.
 * @returns Una respuesta JSON con los datos de ubicación del dispositivo o un mensaje de error.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const deviceId = url.searchParams.get("deviceId");

    // Validar que se ha proporcionado un 'deviceId' en la URL
    if (!deviceId) {
      return NextResponse.json({ error: "Missing deviceId parameter" }, { status: 400 });
    }

    // Parámetros para el comando 'GetCommand'
    const params = {
      TableName: process.env.DYNAMODB_LOCATION_TABLE_NAME, // Nombre de la tabla de DynamoDB
      Key: {
        // La clave a buscar. Debe coincidir con la clave principal de tu tabla.
        deviceId: deviceId,
      },
    };

    // Obtener el registro de la base de datos
    const command = new GetCommand(params);
    const result = await docClient.send(command);

    // Verificar si se encontró el dispositivo
    if (!result.Item) {
      return NextResponse.json({ error: "Device not found or no location recorded" }, { status: 404 });
    }

    // Devolver la última ubicación del dispositivo
    return NextResponse.json(result.Item);
  } catch (error) {
    console.error("Error fetching device location:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}