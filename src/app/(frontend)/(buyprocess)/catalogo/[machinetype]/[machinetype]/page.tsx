import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import Catalogue from "@/components/organlism/Catalogue/CatalogueContainer";
import FilterComponent from "@/components/organlism/FilterComponent/FilterComponent";


type Params = Promise<{ machinetype: string }>


export async function generateMetadata(props: {
  params: Params
}) {
  const params = await props.params
  console.log(params);
}


export default async function MachineTypePage({ params }: { params: Params }) {
  return (
    <FrontSectionWrapper identicator="catalogSection" extraClass=" flex flex-col items-start justify-center md:flex-row gap-3.5 w-full justify-between">

      <div className="flex pt-10 flex-col items-start justify-center md:flex-row gap-3.5 w-full md:justify-between">
        <div className="filter-wrapper w-full md:w-1/4">
          <FilterComponent />
        </div>
        <div className="catalogue-wrapper w-full md:w-3/4">
          <Catalogue machinetype={(await params).machinetype} />
        </div>
      </div>

    </FrontSectionWrapper>
  )
}