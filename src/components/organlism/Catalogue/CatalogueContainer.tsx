// components/organism/Catalogue/CatalogueContainer.tsx
import { sampleData } from "./sampleCatalogueData"; // Simulación temporal
import CatalogueList from "./CatalogueList";
import { interestLinks } from "@/constants/routes/frontend";

export default function CatalogueContainer({slug}: { slug?: string }) {

  const interestLink = interestLinks.find(link => link.name === slug);


  const filteredData = slug? sampleData.filter(item => item?.machine_category === interestLink?.machine_category) : sampleData; // Lógica real se agregará luego
  
  return <CatalogueList items={filteredData} />;
}
