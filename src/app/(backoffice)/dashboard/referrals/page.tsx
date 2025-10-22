import { Metadata } from "next";
import ReferralProgram from "@/components/organism/ReferralProgram/ReferralProgram";

export const metadata: Metadata = {
  title: "Referidos | OnRentX",
  description: "Comparte tu enlace de referidos y gana puntos de lealtad.",
};

export default function ReferralsPage() {
  return <ReferralProgram />;
}
