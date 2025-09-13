import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CheckoutFormData, UseCheckoutFormReturn } from '@/types/checkout';

const paymentSchema = yup.object({
  cardNumber: yup
    .string()
    .required('Número de tarjeta requerido')
    .matches(/^[0-9\s]{13,19}$/, 'Número de tarjeta inválido'),
  cardholderName: yup
    .string()
    .required('Nombre del tarjetahabiente requerido'),
  expiryDate: yup
    .string()
    .required('Fecha de expiración requerida')
    .matches(/^(0[1-9]|1[0-2])\/[0-9]{4}$/, 'Formato debe ser MM/AAAA'),
  securityCode: yup
    .string()
    .required('Código de seguridad requerido')
    .matches(/^[0-9]{3,4}$/, 'Código de seguridad inválido')
});

export function useCheckoutForm(): UseCheckoutFormReturn {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(paymentSchema),
    mode: 'onChange'
  });

  return {
    register,
    errors,
    handleSubmit,
    isSubmitting
  };
}