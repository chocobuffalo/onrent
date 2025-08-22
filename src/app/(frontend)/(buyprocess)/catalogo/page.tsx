import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import CatalogClient from "@/hooks/frontend/buyProcess/useCatalogClient";
import BackButton from "@/components/atoms/BackButton/BackButton";

export const metadata = {
  title: "Catálogo - OnRentX",
  description: "Catálogo de productos",
};

export default function CatalogPage() {
  return (
    <>
        <BackButton size={24} className="pl-10 pt-4" />
        <FrontSectionWrapper identicator="catalogSection" extraClass="py-5">
            <CatalogClient />
        </FrontSectionWrapper>
    </>
  );
}
