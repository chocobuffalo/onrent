// Interfaz base para especificaciones técnicas con tipos numéricos 
export interface TechnicalSpecs {   
    weight_tn: number;   
    height_m: number;   
    width_m: number;   
    seat_count: number;   
    motor_spec: string;   
    fuel_type: string;   
    machine_category: string; 
} 
export interface SpecsInterface{
    type?: string,
    category?: string,
    motor?: string,
    fuel?: string,
    weight_tn?: string,
    height_m?: string,
    width_m?: string,
    seats?: string
}

// Interfaz para datos básicos de maquinaria 
export interface BasicMachineryData {   
    name: string;   
    brand: string;   
    model: string;   
    serial_number: string;   
    machine_type: string;   
    daily_rate: number;   
    status: string;   
    location_info: string; 
}  

// Interfaz para datos de geolocalización 
export interface GeolocationData {   
    gps_lat?: number;   
    gps_lng?: number;   
    geospatial_status?: string; 
}  

// Interfaz completa que combina todas las partes 
export interface CreateMachineryRequest extends BasicMachineryData, TechnicalSpecs, GeolocationData {   
    external_id?: string;   
    image?: File; 
}

export interface ApiMachineryResponse {
  message: string;
  machine_id: number;
  external_id: string;
}

export interface CreateMachineryResponse {   
    success: boolean;   
    data?: ApiMachineryResponse;
    message?: string;   
    error?: string; 
}

// Respuesta de la API para listado de maquinarias
export interface MachineryResponse {
  id: number;
  name: string;
  machine_category: string;
  serial_number: string;
  status: string;
  brand?: string;
  model?: string;
  daily_rate?: number;
  location_info?: string;
  machine_type?: string;
  weight_tn?: number;
  motor_spec?: string;
  height_m?: number;
  width_m?: number;
  seat_count?: number;
  fuel_type?: string;
  gps_lat?: number;
  gps_lng?: number;
  geospatial_status?: string;
  image?: string;
  external_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Resultado de operaciones de maquinaria
export interface GetMachineryResult {
  success: boolean;
  data?: MachineryResponse[];
  message?: string;
  error?: string;
}

// Configuración de columnas para tablas dinámicas
export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, item: MachineryResponse) => React.ReactNode;
}

// Opciones de estado para tablas
export interface StatusOption {
  value: string;
  label: string;
}

// Colores de estado para tablas
export interface StatusColors {
  [key: string]: string;
}

// Botones de acción para tablas
export interface ActionButton {
  label: string;
  className: string;
  onClick: (item?: MachineryResponse) => void;
}

// Esquema de validación para formularios de maquinaria
export interface MachineFormData {
  name: string;
  brand: string;
  model: string;
  serial_number: string;
  machine_type: string;
  daily_rate: number;
  status: string;
  location_info: string;
  weight_tn: number;
  motor_spec: string;
  height_m: number;
  width_m: number;
  seat_count: number;
  fuel_type: string;
  machine_category: string;
  image?: FileList;
  gps_lat?: number;
  gps_lng?: number;
}

// Props para DynamicTable
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
  onStatusChange?: (itemId: number | string, newStatus: string) => void;
  onAction?: (action: string, item: any) => void;
}