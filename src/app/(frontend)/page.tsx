import BenefitsComponent from "@/components/organism/benefitsComponent";
import CategoriesSection from "@/components/organism/categoriesSection";
import FooterBanner from "@/components/organism/footerBanner";
import HeroSlider from "@/components/organism/heroSlider";
import ProcessComponent from "@/components/organism/processComponent";

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
