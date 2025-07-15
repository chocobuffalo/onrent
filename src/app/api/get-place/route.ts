import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('place');


    if (!location) {
        return new Response('Missing location or type', { status: 400 });
    }

    try {


    // Realizar la petición
    const response = await axios({
      method: 'get',
      url: `${process.env.AWS_URL}/place/${location}`,
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        key: process.env.AWS_KEY,
        language:"es"
      }
    });

    // Devolver la respuesta formateada
    return NextResponse.json({
      data: response.data
    });
    } catch (error) {
        console.error('Error in get-place request:', error);
        return NextResponse.json(
            { error: 'Failed to fetch place data' },
            { status: 500 }
        );
        
    }
}