import AOSWrapper from "@/components/atoms/aosWrapper";
import SectionTitle from "@/components/atoms/sectionTitle/sectionTitle";
import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import ProcessCarousel from "@/components/molecule/processCarousel/processCarousel";
import { ProcessItems } from "@/constants/routes/home";

export default function ProcessComponent(){
    return(
        <FrontSectionWrapper identicator="processSection" extraClass="bg-[#EAEAEA] py-10">
            <AOSWrapper animation="fade-in" delay={0} duration={1000}>
                <SectionTitle title="¿Cómo funciona?" />
            </AOSWrapper>
            <AOSWrapper animation="fade-in" delay={200} duration={1000}>
                <ProcessCarousel items={ProcessItems} />
            </AOSWrapper>
        </FrontSectionWrapper> 
    )
}