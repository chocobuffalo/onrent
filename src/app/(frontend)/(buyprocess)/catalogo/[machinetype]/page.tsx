import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import CatalogClient from "@/hooks/frontend/buyProcess/useCatalogClient";
import { interestLinks } from "@/constants/routes/frontend";
import BackButton from "@/components/atoms/BackButton/BackButton";

type Params = Promise<{ machinetype: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { machinetype } = await params;
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
    <>
      <BackButton size={24} className="pl-10 pt-4"/>
      <FrontSectionWrapper identicator="catalogSection" extraClass="py-5">
        <CatalogClient slug={machinetype} />
      </FrontSectionWrapper>
    </>
  );
}
