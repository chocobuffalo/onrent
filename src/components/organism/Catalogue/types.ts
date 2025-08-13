import { SpecsInterface } from "@/types/machinary";

export interface PricingInterface {
  price_per_day: number;
  discount_week: number;
  discount_month: number;
  no_operator_discount: number;
  no_fuel_discount: number;
}

export interface CatalogueItem {
  id: number;
  name: string;
  location?: string; // API puede no enviarlo
  price?: string; // para compatibilidad anterior
  image: string;
  machinetype?: string;
  machine_category?: string;
  description?: string; // <-- agregado
  specs?: SpecsInterface;
  pricing?: PricingInterface; // <-- agregado
}
