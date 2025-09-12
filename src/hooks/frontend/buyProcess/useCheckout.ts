import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useCheckoutForm } from '@/hooks/frontend/buyProcess/useCheckoutForm';
import { CheckoutFormData, Machine, PriceFormatted } from '@/types/checkout';
import useDateRange from '@/hooks/frontend/buyProcess/usaDateRange';
import { countDays } from '@/utils/compareDate';

export function useCheckout(router: AppRouterInstance, machine?: Machine) {
  const { register, errors, handleSubmit, isSubmitting } = useCheckoutForm();
  
  const handleBack = () => router.back();
  
  const onSubmit = (data: CheckoutFormData) => {
    console.log('Datos de pago:', data);
  };
  
  const { startDate, endDate } = useDateRange();
  
  const safeDays = (() => {
    try {
      const d = countDays(startDate as any, endDate as any);
      return Number.isFinite(d) && d > 0 ? d : 0;
    } catch {
      return 0;
    }
  })();
  
  const unit = machine?.price ?? 0;
  
  // Calcular el precio de rental basado en días y precio unitario
  const rental = unit * safeDays;
  
  const freight = 50;
  const insurance = 200;
  const taxes = 30;
  
  const total = rental + freight + insurance + taxes;
  
  const fmt = (n: number) => `${n.toLocaleString('es-ES')}$/USD`;
  
  const priceFormatted: PriceFormatted = {
    rental: fmt(rental),
    freight: fmt(freight),
    insurance: fmt(insurance),
    taxes: fmt(taxes),
    total: fmt(total),
  };
  
  return {
    register,
    errors,
    handleSubmit,
    isSubmitting,
    handleBack,
    onSubmit,
    priceFormatted,
  };
}