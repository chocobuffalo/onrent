export interface OrderResponse {
  order_id: number;
  state: string;
  machine_name: string;
  start_date: string;
  end_date: string;
}

export interface LocationCoords {
  lat?: number;
  lng?: number;
  additionalProp1?: number;
  additionalProp2?: number;
  additionalProp3?: number;
}

export interface OrderDetail {
  order_id: number;
  state: string;
  machine_name: string;
  start_date: string;
  end_date?: string;
  name?: string;
  operator_name?: string;
  provider_name?: string;
  project: string;
  duration_days: number;
  location_coords: LocationCoords;
  work_description: string;
  items: any[];
  rental_total: number;
  fleet_cost: number;
  insurance_cost: number;
  taxes: number;
  total_final: number;
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