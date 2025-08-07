import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import Catalogue from "@/components/organism/Catalogue/CatalogueContainer";
import FilterComponent from "@/components/organism/FilterComponent/FilterComponent";


export const metadata = {
    title: 'Catálogo - OnRentX',
    description: 'Catálogo de productos',
}

export default async function CatalogPage(){
    //get path params
    return (
        <FrontSectionWrapper identicator="catalogSection" extraClass="py-20">
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
