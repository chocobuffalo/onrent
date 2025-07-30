// components/organism/Catalogue/types.ts
export interface CatalogueItem {

  id: number;
  name: string;
  location: string;
  price: string;
  image: string;
    machinetype?: string; // <-- nuevo

}

export interface CatalogueProps {
  slug?: string;
}
