import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query, center } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Intentar con AWS Location Service primero
    const awsKey = process.env.AWS_ACCESS_KEY || process.env.NEXT_PUBLIC_AWS_KEY;
    const region = process.env.AWS_REGION || 'us-east-2';
    const indexName = process.env.AWS_INDEX_NAME || 'Ubicacion_obra';

    if (awsKey) {
      try {
        const awsResponse = await fetch(
          `https://places.geo.${region}.amazonaws.com/places/v0/indexes/${indexName}/search/text?key=${awsKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Text: query,
              MaxResults: 5,
              BiasPosition: center || [-123.115898, 49.295868]
            }),
          }
        );

        if (awsResponse.ok) {
          const awsData = await awsResponse.json();
          return NextResponse.json({
            Results: awsData.Results || [],
            source: 'aws'
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
        headers: { 'User-Agent': process.env.NOMINATIM_USER_AGENT || 'OnRentX/1.0' }
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
        source: 'nominatim'
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
