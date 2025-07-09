import BenefitsComponent from "@/components/organlism/benefitsComponent";
import CategoriesSection from "@/components/organlism/categoriesSection";
import FooterBanner from "@/components/organlism/footerBanner";
import HeroSlider from "@/components/organlism/heroSlider";
import ProcessComponent from "@/components/organlism/processComponent";

export default function Home() {
  return (
   <>
   <HeroSlider/>
   <CategoriesSection/>
   <ProcessComponent />
   <BenefitsComponent/>
   <FooterBanner/>
   </>
  );
}
