// components/organism/Catalogue/types.ts
export interface CatalogueItem {
  id: number;
  name: string;
  location: string;
  price: string;
  image: string;
  machinetype?: string; // <-- nuevo
  machine_category: string;
}

export interface CatalogueProps {
  slug?: string;
}
