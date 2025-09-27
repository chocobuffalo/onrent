// Interfaz para los elementos de renta
export interface RentalItem {
  machine_id: string;
  machine_name?: string;
  quantity?: number;
  daily_rate?: number;
  duration_days?: number;
  subtotal?: number;
}

export interface OrderResponse {
  order_id: number;
  state: string;
  machine_name: string;
  start_date: string;
  end_date: string;
  machine_id?: string; // Para compatibilidad directa
  rental_items?: RentalItem[]; // Array de elementos rentados
}

export interface LocationCoords {
  lat?: number;
  lng?: number;
  additionalProp1?: number;
  additionalProp2?: number;
  additionalProp3?: number;
}

export interface OrderItem {
  line_id: number;
  product: string;
  start_date: string;
  end_date: string;
  quantity: number;
  machine: string | null;
  provider: string | null;
  rent_price: number;
  fleet_cost: number;
  extras: number;
  total_price: number;
}

export interface OrderDetail {
  order_id: number;
  name: string;
  state: string;
  project: string | null;
  client_name: string | null;
  client_phone: string | null;
  responsible_name: string | null;
  responsible_phone: string | null;
  net_provider_price: number | null;
  commission_rate: number | null;
  response_state: string | null;
  machine_name: string | null;
  operator_name: string | null;
  provider_name: string | null;
  start_date: string;
  end_date: string;
  duration_days: number;
  location_coords: LocationCoords;
  location: string;
  work_description: string | null;
  work_image: string | null;
  items: OrderItem[];
  rental_total: number;
  fleet_cost: number;
  insurance_cost: number;
  taxes: number;
  total_final: number;
  invoice: string | null;
  cancellation_policy: string | null;
  refund_type: string | null;
  penalty_amount: number;
}

export interface GetOrdersResult {
  success: boolean;
  data?: OrderResponse[];
  message?: string;
  error?: string;
}

export interface GetOrderDetailResult {
  success: boolean;
  data?: OrderDetail;
  message?: string;
  error?: string;
}

export interface BaseApiResult {
  success: boolean;
  message?: string;
  error?: string;
}