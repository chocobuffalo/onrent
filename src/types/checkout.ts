import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface CheckoutFormData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  securityCode: string;
}

export interface ProjectInfo {
  responsibleName: string;
  projectName: string;
  workLocation: string;
}

export interface Machine {
  id: number | string;
  name: string;
  price: number;
  machinetype: string;
  description?: string;
  image?: string;
  availability?: boolean;
}

export interface BackButtonProps {
  onClick: () => void;
}

export interface SubmitButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export interface PaymentFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export interface ItemProps {
  total_estimated: number;
  monthly_payment: number;
  duration_days: number;
  end_date: number;
  estimated_taxes: number;
  estimated_extras: number;
  estimated_fleet: number;
  estimated_rent: number;
  location: { lat: number; lng: number };
  product_id: number | string | null;
  product_name: string;
  requested_quantity: number;
  session_id: string;
  start_date: string;
}

export interface OrderProp {
  id: number | string | null;
  preorder_id: string;
  session_id: string;
  project_id: number;
  project_name: string;
  project_responsible: string;
  project_location: string;
  client_notes: string;
  status: string;
  ui_notice?: string | null;
  items: ItemProps[];
}

export interface CheckoutProps {
  order: OrderProp | null;
  router: AppRouterInstance;
}

export interface CheckoutWithLogicProps extends CheckoutProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  handleSubmit: (onSubmit: (data: CheckoutFormData) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  handleBack: () => void;
  onSubmit: (data: CheckoutFormData) => void;
}

export interface UseProjectInfoReturn {
  projectInfo: ProjectInfo | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseMachineDataReturn {
  machine: Machine | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseCheckoutFormReturn {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  handleSubmit: (onSubmit: (data: CheckoutFormData) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
}

export interface PriceFormatted {
  rental: string;
  freight: string;
  insurance: string;
  taxes: string;
  total: string;
}
