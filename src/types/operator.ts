import { ReactNode } from "react";


// ==========================
// Datos básicos del operador
// ==========================
export interface BasicOperatorData {
  name: string;
  email: string;
  password: string;
  phone: string;
  curp: string;
  license_number: string;
  license_type: string; 
  region_id: string;
}

// ==========================
// Geolocalización
// ==========================
export interface GeolocationData {
  gps_lat: number | null | undefined;
  gps_lng: number | null | undefined;
  geospatial_status?: string;
}

// ==========================
// Requests
// ==========================
export interface CreateOperatorRequest extends BasicOperatorData, GeolocationData {
  address: string; 
}

export interface UpdateOperatorRequest extends Partial<BasicOperatorData> {
  id: number;
  gps_lat?: number | null;
  gps_lng?: number | null;
  geospatial_status?: string;
  availability?: "available" | "unavailable" | "busy";
  active?: boolean;
  address?: string; 
}

export interface DeleteOperatorRequest {
  id: number;
  confirmMessage?: string;
}

// ==========================
// Respuestas del backend
// ==========================
export interface ApiOperatorResponse {
  message: string;
  operator_id: number;
  external_id?: string;
}

export interface CreateOperatorResponse {
  success: boolean;
  data?: ApiOperatorResponse;
  message?: string;
  error?: string;
}

export interface UpdateOperatorResponse {
  success: boolean;
  data?: ApiOperatorResponse;
  message?: string;
  error?: string;
}

export interface DeleteOperatorResponse {
  success: boolean;
  data?: {
    id: number;
    name: string;
    message: string;
  };
  message?: string;
  error?: string;
}

// ==========================
// Representaciones de operador
// ==========================
export interface OperatorResponse {
  operator_id: number;
  external_id: string;
  name: string;
  phone: string | null;
  email: string;
  availability: "available" | "unavailable" | "busy";
  active: boolean;
  address?: string; 
  curp?: string;
  license_number?: string;
  license_type?: string;
  region_id?: number;
  gps_lat?: number | null;
  gps_lng?: number | null;
}

export interface OperatorDetailResponse {
  operator_id: number;
  external_id: string;
  name: string;
  curp?: string;
  license_number?: string;
  license_type?: string;
  phone?: string | null;
  email: string;
  dc3_filename?: string;
  license_filename?: string;
  operator_photo_filename?: string;
  experience_years?: number;
  experience_level?: "beginner" | "intermediate" | "expert";
  training_status?: "pending" | "completed";
  has_epp?: boolean;
  availability: "available" | "unavailable" | "busy";
  gps_lat?: number | null;
  gps_lng?: number | null;
  region_id?: number | null;
  region_name?: string | null;
  compatible_machines?: { machine_id: number; name: string }[];
  notes?: string;
  active: boolean;
}

// ==========================
// Otros
// ==========================
export type GetOperatorsResult = OperatorResponse[];

export interface OperatorFormData extends BasicOperatorData, GeolocationData {
  address: string; 
}

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, item: any) => ReactNode;
}

export interface ActionButton {
  label: string;
  className: string;
  onClick: (item?: any) => void;
}
