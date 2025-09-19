import { NextResponse } from "next/server";

// Datos de prueba: operadores activos
const operators = [
  {
    id: 1,
    lat: 19.4326,
    lng: -99.1332,
    name: "Operador 1",
    status: "activo"
  },
  {
    id: 2,
    lat: 19.427,
    lng: -99.167,
    name: "Operador 2",
    status: "activo"
  },
  {
    id: 3,
    lat: 19.44,
    lng: -99.14,
    name: "Operador 3",
    status: "activo"
  }
];

export async function GET() {
  // Simula autenticación si lo necesitas
  // const auth = req.headers.get('authorization');
  // if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  return NextResponse.json(operators);
}
