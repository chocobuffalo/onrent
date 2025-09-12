import Footer from "@/components/organism/footer/footer";
import Header from "@/components/organism/header";
import "../../assets/css/frontend.css";
import TrackingPixels from "../../components/molecule/tracking/TrackingPixels";
import WhatsAppWidget from "@/components/molecule/whatsapp/WhatsAppWidget";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="">
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
    </>
  );
}
