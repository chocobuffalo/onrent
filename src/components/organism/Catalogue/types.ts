import { SpecsInterface } from "@/types/machinary";

// components/organism/Catalogue/types.ts
export interface CatalogueItem {
  id: number;
  name: string;
  location: string;
  price: string;
  image: string;
  machinetype?: string; // <-- nuevo
  machine_category: string;
  specs?: SpecsInterface;
}

export interface CatalogueProps {
  slug?: string;
}
