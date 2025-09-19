import { NextResponse } from "next/server";

// Datos de prueba: máquina asignada al operador
const assignedMachine = {
  id: 102,
  gps_lat: 19.43,
  gps_lng: -99.15,
  name: "Retroexcavadora JCB",
  machine_category: "retroexcavadora",
  status: "en_renta"
};

export async function GET() {
  return NextResponse.json({ machine: assignedMachine });
}
