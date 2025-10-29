"use client";

import Footer from "@/components/organism/footer/footer";
import Header from "@/components/organism/header";
import "../../assets/css/frontend.css";
import TrackingPixels from "../../components/molecule/tracking/TrackingPixels";
import WhatsAppWidget from "@/components/molecule/whatsapp/WhatsAppWidget";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // Detectar si vienes del dashboard hacia el front → forzar reload
    if (prevPath.current?.startsWith("/dashboard") && pathname.startsWith("/front")) {
      console.log("Volviendo del dashboard al front → forzando reload");
      window.location.reload();
    }
    prevPath.current = pathname;
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <TrackingPixels />
        {children}
      </main>
      <Footer />

      <WhatsAppWidget
        // Opcional: puedes pasar props si quieres sobreescribir valores por página
        // brand="OnRentX"
        // avatarSrc="/footer-logo.svg"
        // greeting="¡Hola! 👋 ¿Buscas una máquina?"
        // defaultMessage="Hola, me interesa cotizar una retroexcavadora."
        // supportHours="L–V 9:00–18:00 (CST)"
      />
    </div>
  );
}
