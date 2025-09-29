import { Metadata } from "next";
import OrdersTable from "@/components/organism/OrdersTable/OrdersTable"

export const metadata: Metadata = {
  title: 'Órdenes',
  description: 'Administra y visualiza todas las órdenes de trabajo',
}

export default function Orders() {
  return (
    <div>
      <OrdersTable />
    </div>
  );
}