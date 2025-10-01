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
  state: 'pending' | 'in_progress' | 'completed';
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
  dynamic_rent: number;
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

export interface MarkTransferArrivedResult extends BaseApiResult {
}
