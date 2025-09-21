// src/app/api/get-map/search/route.ts

import { NextRequest, NextResponse } from "next/server";
import { LocationClient, SearchPlaceIndexForTextCommand } from "@aws-sdk/client-location";

// Usar la variable de entorno de tu proyecto
const AWS_REGION = process.env.AWS_REGION || "us-east-2"; 
const PLACE_INDEX_NAME = process.env.AWS_GEOCODING_INDEX_NAME; 
const NOMINATIM_USER_AGENT = process.env.NOMINATIM_USER_AGENT || 'OnRentX/1.0';

// Crea una instancia del cliente de AWS Location
const locationClient = new LocationClient({ region: AWS_REGION });

export async function POST(request: NextRequest) {
  try {
    const { query, center } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }
    
    // Si AWS_PLACE_INDEX no está definido, salta la lógica de AWS y usa Nominatim.
    if (PLACE_INDEX_NAME) {
      // Usar el SDK de AWS Location Service
      try {
        const awsCommand = new SearchPlaceIndexForTextCommand({
          IndexName: PLACE_INDEX_NAME,
          Text: query,
          MaxResults: 5,
          BiasPosition: center || [-123.115898, 49.295868],
        });
        
        const awsResponse = await locationClient.send(awsCommand);

        if (awsResponse.Results) {
          return NextResponse.json({
            Results: awsResponse.Results,
            source: 'aws',
          });
        }
      } catch (awsError) {
        console.warn('AWS Location Service failed, falling back to Nominatim:', awsError);
      }
    }
    
    // Fallback a Nominatim
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: { 'User-Agent': NOMINATIM_USER_AGENT }
      }
    );

    if (nominatimResponse.ok) {
      const nominatimData = await nominatimResponse.json();
      const results = nominatimData.map((item: any) => ({
        Place: {
          Label: item.display_name,
          Geometry: { Point: [parseFloat(item.lon), parseFloat(item.lat)] },
          Country: item.address?.country || item.address?.country_code
        }
      }));

      return NextResponse.json({
        Results: results,
        source: 'nominatim',
      });
    }

    return NextResponse.json(
      { error: "All geocoding services failed" },
      { status: 500 }
    );

  } catch (error) {
    console.error('Places search API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}