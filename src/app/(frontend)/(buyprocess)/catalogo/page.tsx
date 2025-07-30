// app/machinery/[machinetype]/page.tsx

import CatalogueContainer from "@/components/catalogue/CatalogueContainer";
import FilterComponent from "@/components/filters/FilterComponent";
import FrontSectionWrapper from "@/components/layout/FrontSectionWrapper";

interface Params {
  machinetype: string;
}

export default async function MachineTypePage({ params }: { params: Params }) {
  const { machinetype } = params;

  return (
    <FrontSectionWrapper
      identicator="catalogSection"
      extraClass="py-10 px-4 md:px-10 bg-gray-100 min-h-screen"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <FilterComponent />
        </div>
        <div className="w-full md:w-3/4">
          <CatalogueContainer slug={machinetype} />
        </div>
      </div>
    </FrontSectionWrapper>
  );
}
