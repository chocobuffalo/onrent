import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import CatalogClient from "@/hooks/frontend/buyProcess/useCatalogClient";
import { interestLinks } from "@/constants/routes/frontend";

type Params = { machinetype: string };

export async function generateMetadata({ params }: { params: Params }) {
  const { machinetype } = params;

  const title =
    interestLinks.find((link) => link.name === machinetype)?.title ||
    "Catálogo de Maquinaria";

  return {
    title: `${title} - OnRentX`,
    description: `Explora nuestro catálogo de ${title.toLowerCase()} en OnRentX. Encuentra maquinaria de alta calidad cerca de ti y realiza tu renta de forma segura y confiable.`,
  };
}

export default function MachineTypePage({ params }: { params: Params }) {
  const { machinetype } = params;

  return (
    <FrontSectionWrapper identicator="catalogSection" extraClass="py-5">
      <CatalogClient slug={machinetype} />
    </FrontSectionWrapper>
  );
}
