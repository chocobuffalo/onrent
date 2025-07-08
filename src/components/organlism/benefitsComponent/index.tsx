import AOSWrapper from "@/components/atoms/aosWrapper";
import SectionTitle from "@/components/atoms/sectionTitle/sectionTitle";
import BenefitsCarousel from "@/components/molecule/benefitsCarousel";
import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import { benefits } from "@/constants/routes/home";


export default function BenefitsComponent() {
    return (
        <FrontSectionWrapper identicator="benefits" extraClass="py-10">
            <AOSWrapper animation="fade-in" delay={0} duration={1000}>  
                <SectionTitle title="Beneficios" extraClass="text-center" />            
            </AOSWrapper>
            <AOSWrapper animation="fade-in" delay={200} duration={1000}>
                <BenefitsCarousel items={benefits} />
            </AOSWrapper> 
            
        </FrontSectionWrapper>
    )
}