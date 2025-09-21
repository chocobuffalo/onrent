// src/app/api/location/get-fleet-locations/route.ts

import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

/**
 * Cliente para interactuar con la base de datos DynamoDB.
 */
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Manejador de ruta para obtener las ubicaciones de todos los dispositivos de una flota.
 * Esta API es utilizada por el proveedor para visualizar su flota completa.
 * @param req La solicitud HTTP entrante, que puede contener un ID de proveedor.
 * @returns Una respuesta JSON con un array de ubicaciones de la flota o un mensaje de error.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const providerId = url.searchParams.get("providerId");

    // Parámetros para el comando 'ScanCommand'
    const params = {
      TableName: process.env.DYNAMODB_LOCATION_TABLE_NAME, // Nombre de la tabla de DynamoDB
      FilterExpression: "providerId = :p", // Usar un filtro si tienes un atributo de proveedor
      ExpressionAttributeValues: {
        ":p": providerId,
      },
    };

    // Obtener los registros de la base de datos.
    // Usar ScanCommand puede ser costoso para tablas grandes. Considera otras estrategias
    // si el número de máquinas es muy alto.
    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items) {
      return NextResponse.json({ locations: [] });
    }

    return NextResponse.json({ locations: result.Items });
  } catch (error) {
    console.error("Error fetching fleet locations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}