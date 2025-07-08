import BenefitsComponent from "@/components/organlism/benefitsComponent";
import FooterBanner from "@/components/organlism/footerBanner";
import ProcessComponent from "@/components/organlism/processComponent";
import Image from "next/image";

export default function Home() {
  return (
   <>
   <ProcessComponent />
   <BenefitsComponent/>
   <FooterBanner/>
   </>
  );
}
