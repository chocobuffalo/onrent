// src/types/orders.ts
export interface OrderResponse {
  order_id: number;
  name: string;
  state: string;
  machine_name: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  location_coords: LocationCoords;
  work_description: string;
  project: string;
  operator_name: string;
  provider_name: string;
  dynamic_rent: number;
  fleet_cost: number;
  extra_charges: number;
  final_price: number;
  state_code?: string;
  x_client_rating?: number | null;
  rating_dismissed?: boolean;
}
// Helper para verificar si una orden está confirmada
export const isConfirmedOrder = (order: OrderResponse): boolean => {
  const confirmedStates = ["pendiente de asignacion", "confirmada"];
  return confirmedStates.includes(order.state.toLowerCase());
};
// ✅ CORREGIDO: Agregadas propiedades latitude/longitude para compatibilidad
export interface LocationCoords {
  lat?: number;
  lng?: number;
  latitude?: number;  // Alias para compatibilidad con AWS Location Service
  longitude?: number; // Alias para compatibilidad con AWS Location Service
  additionalProp1?: number;
  additionalProp2?: number;
  additionalProp3?: number;
}

// ✅ NUEVO: Tipo para location cuando es un objeto completo con dirección
export interface LocationWithAddress {
  address: string;
  latitude: number;
  longitude: number;
  lat?: number;  // Alias opcional
  lng?: number;  // Alias opcional
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

// ✅ MEJORADO: location puede ser string O objeto con coordenadas
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
  location: string | LocationWithAddress; // ✅ Puede ser string o objeto
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

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface ActionButton {
  label: string;
  onClick: (item: any) => void;
  className?: string;
}

export interface StatusColors {
  [key: string]: string;
}

export interface RentalTableProps {
  title?: string;
  items?: any[];
  isLoading?: boolean;
  error?: string | null;
  searchValue?: string;
  columns?: TableColumn[];
  statusField?: string;
  statusOptions?: StatusOption[];
  statusColors?: StatusColors;
  actionButtons?: ActionButton[];
  onSearch?: (value: string) => void;
  onStatusChange?: (itemId: any, newStatus: string) => void;
}

export interface DynamicTableProps {
  title?: string;
  items?: any[];
  isLoading?: boolean;
  error?: string | null;
  searchValue?: string;
  columns?: TableColumn[];
  statusField?: string;
  statusOptions?: StatusOption[];
  statusColors?: StatusColors;
  actionButtons?: ActionButton[];
  onSearch?: (value: string) => void;
  onStatusChange?: (itemId: any, newStatus: string) => void;
}

export interface Transfer {
  transfer_id: number;
  order_id: number;
  name: string;
  state: 'draft' | 'confirmed' | 'in_progress' | 'done' | 'cancelled';
  machine_name: string;
  start_date: string;
  end_date: string;
  duration_days: number;
}

export interface TransferDetail extends Transfer {
  location_coords: LocationCoords;
  work_description: string;
  project: string;
  operator_name: string;
  provider_name: string;
  provider_phone?: string;
  client_name?: string; 
  client_phone?: string;
  origin?: string;
  destination?: string;
}

export interface GetTransfersResult {
  success: boolean;
  data?: Transfer[];
  message?: string;
  error?: string;
}

export interface GetTransferDetailResult {
  success: boolean;
  data?: TransferDetail;
  message?: string;
  error?: string;
}

export type MarkTransferArrivedResult = BaseApiResult;

// ✅ NUEVAS: Funciones helper para normalizar coordenadas
export const normalizeLocationCoords = (coords: LocationCoords): { lat: number; lng: number } | null => {
  const lat = coords.latitude ?? coords.lat;
  const lng = coords.longitude ?? coords.lng;
  
  if (typeof lat === 'number' && typeof lng === 'number' && 
      !isNaN(lat) && !isNaN(lng)) {
    return { lat, lng };
  }
  
  return null;
};

export const isLocationWithAddress = (location: any): location is LocationWithAddress => {
  return (
    typeof location === 'object' &&
    location !== null &&
    'address' in location &&
    ('latitude' in location || 'lat' in location) &&
    ('longitude' in location || 'lng' in location)
  );
};