import { NextResponse } from "next/server";

// Es una buena práctica definir los tipos de datos que manejas.
// Esto te ayuda a evitar errores y hace tu código más legible.
type MachineStatus = "disponible" | "en_renta" | "mantenimiento";

interface Machine {
  id: number;
  gps_lat: number;
  gps_lng: number;
  name: string;
  machine_category: string;
  status: MachineStatus;
}

// Datos de prueba: máquinas. Mover esto a un archivo separado (ej. /lib/mockData.ts)
// sería ideal para mantener la lógica de la API limpia.
const machines: Machine[] = [
  {
    id: 101,
    gps_lat: 19.435,
    gps_lng: -99.14,
    name: "Excavadora CAT 320",
    machine_category: "excavadora",
    status: "disponible",
  },
  {
    id: 102,
    gps_lat: 19.43,
    gps_lng: -99.15,
    name: "Retroexcavadora JCB",
    machine_category: "retroexcavadora",
    status: "en_renta",
  },
  // ... más máquinas
];

export async function GET() {
  return NextResponse.json({ success: true, data: machines });
}
