import SectionTitle from "@/components/atoms/sectionTitle/sectionTitle";
import CategoriesRow from "@/components/molecule/categoriesRow";
import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import { interestLinks } from "@/constants/routes/frontend";

export default function CategoriesSection(){
    return(
        <FrontSectionWrapper identicator="categories-section" extraClass='py-10 pt-20'>
            <div className='flex flex-col justify-center items-center'>
                <SectionTitle title="Catálogo Destacado" extraClass="pb-3.5" />
            </div>
            <CategoriesRow items={interestLinks}/>
        </FrontSectionWrapper>
    )
}
