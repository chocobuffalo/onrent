import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import Catalogue from "@/components/organlism/Catalogue/Catalogue";
import FilterComponent from "@/components/organlism/FilterComponent/FilterComponent";


export default async function CatalogPage(){
    //get path params
    return (
        <FrontSectionWrapper identicator="catalogSection" extraClass="py-10">
            <div className="flex flex-col items-start justify-center lg:flex-row gap-3.5 w-full md:justify-between">
                <div className="filter-wrapper w-full lg:w-1/4">
                    <FilterComponent />
                </div>
                <div className="catalogue-wrapper w-full lg:w-3/4">
                    <Catalogue />
                </div>
            </div>
        </FrontSectionWrapper>
    )
}