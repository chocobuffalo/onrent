import { Metadata } from "next";
import RentalOrdersTable from "@/components/organism/RentalOrdersTable/RentalOrdersTable"

export const metadata: Metadata = {
  title: 'Rentas',
  description: 'Consulta y gestiona las órdenes de alquiler de equipos',
}

export default function Rentals() {
  return (
    <div>
      <RentalOrdersTable />
    </div>
  );
}