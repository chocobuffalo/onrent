// components/organism/Catalogue/CatalogueContainer.tsx
import { sampleData } from "./sampleCatalogueData"; // Simulación temporal
import CatalogueList from "./CatalogueList";

export default function CatalogueContainer() {
  const filteredData = sampleData; // Lógica real se agregará luego
  return <CatalogueList items={filteredData} />;
}
