import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import Catalogue from "@/components/organism/Catalogue/CatalogueContainer";
import FilterComponent from "@/components/organism/FilterComponent/FilterComponent";
import { interestLinks } from "@/constants/routes/frontend";
// import { title } from "process";

type Params = Promise<{ machinetype: string }>;

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  // console.log(params);
  // Aquí puedes definir la metadata de la página
  // Por ejemplo, puedes usar el parámetro machinetype para personalizar el título
  // o la descripción de la página.
  // Si machinetype es 'heavy', podrías poner un título como "Catálogo de Maquinaria Pesada"
  // Si es 'light', "Catálogo de Maquinaria Ligera", etc.
  // Si no se proporciona machinetype, puedes usar un título genérico como "Catálogo de Maquinaria"
  // Asegúrate de que el título sea relevante para el contenido de la página.
  const { machinetype } = params;
  const title =
    interestLinks.find((link) => link.name === machinetype)?.title ||
    "Catálogo de Maquinaria";
  return {
    title: `${title} - OnRentX`,
    description: `Explora nuestro catálogo de ${title.toLowerCase()} en OnRentX. Encuentra maquinaria de alta calidad cerca de ti y realiza tu renta de forma segura y confiable.`,
  };
}

export default async function MachineTypePage({ params }: { params: Params }) {
  const { machinetype } = await params;
  return (
    <FrontSectionWrapper identicator="catalogSection" extraClass="py-20">
      <div className="flex pt-10 flex-col items-start justify-center lg:flex-row gap-3.5 w-full md:justify-between">
        <div className="filter-wrapper w-full lg:w-1/4">
          <FilterComponent />
        </div>
        <div className="catalogue-wrapper w-full lg:w-3/4">
          <Catalogue slug={machinetype} />
        </div>
      </div>
    </FrontSectionWrapper>
  );
}
