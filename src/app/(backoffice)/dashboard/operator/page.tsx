// src/app/(backoffice)/dashboard/operator/page.tsx
import { Metadata } from "next";
import OperatorUI from "@/components/organism/OperatorUI/OperatorUI";

export const metadata: Metadata = {
  title: "Operadores",
  description: "Gestiona tus operadores",
};

export default function OperatorPage() {
  return <OperatorUI />;
}