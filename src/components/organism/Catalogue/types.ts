import { SpecsInterface } from "@/types/machinary";

export interface PricingInterface {
  price_per_day: number;
  discount_week: number;
  discount_month: number;
  days_per_week_factor: number; 
  days_per_month_factor: number;
  no_operator_discount: number;
  no_fuel_discount: number;
}

export interface CatalogueItem {
  id: number;
  name: string;
  location?: string; // API puede no enviarlo
  price?: string; // para compatibilidad anterior
  list_price: number;
  image: string;
  machinetype?: string;
  machine_category?: string;
  description?: string; // <-- agregado
  specs?: SpecsInterface;
  pricing?: PricingInterface; // <-- agregado
}
