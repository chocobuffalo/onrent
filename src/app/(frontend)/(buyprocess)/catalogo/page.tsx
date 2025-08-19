import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import CatalogClient from "@/hooks/frontend/buyProcess/useCatalogClient";

export const metadata = {
  title: "Catálogo - OnRentX",
  description: "Catálogo de productos",
};

export default function CatalogPage() {
  return (
    <FrontSectionWrapper identicator="catalogSection" extraClass="py-20">
      <CatalogClient />
    </FrontSectionWrapper>
  );
}
