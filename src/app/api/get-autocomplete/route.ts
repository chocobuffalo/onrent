import axios from 'axios';
import { NextResponse } from 'next/server';



interface AutocompleteRequest {
  QueryText: string | null;
  Language: string;
  MaxResults: string;
}
export async function GET(request: Request) {
  try {
    // Validar que la variable de entorno esté definida
    if (!process.env.AWS_URL) {
      throw new Error('AWS_URL environment variable is not defined');
    }
    if (!process.env.AWS_KEY) {
      throw new Error('AWS_KEY environment variable is not defined');
    }

    // Obtener parámetro de consulta
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    // Validar parámetro query
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Configurar el cuerpo de la petición
    const requestBody: AutocompleteRequest = {
      QueryText: query,
      Language: 'es',
      MaxResults: '10'
    };

    // Realizar la petición
    const response = await axios({
      method: 'post',
      url: `${process.env.AWS_URL}/autocomplete`,
      data: requestBody,
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        key: process.env.AWS_KEY
      }
    });

    // Devolver la respuesta formateada
    return NextResponse.json({
      query,
      data: response.data
    });
    
  } catch (error) {
    console.error('Error in autocomplete request:', error);
    
    // Manejar diferentes tipos de errores
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}