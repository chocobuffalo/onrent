'use client';

import { useRouter } from 'next/navigation';
import Checkout from '@/components/organism/Checkout/Checkout';
import { useMachineCheckout } from '@/hooks/frontend/buyProcess/useMachineCheckout';
import { useCheckout } from '@/hooks/frontend/buyProcess/useCheckout';

export default function CheckoutPage() {
  const router = useRouter();

  const { machine, isLoading, error } = useMachineCheckout('123');


  const checkoutLogic = useCheckout(router, machine || undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !machine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || 'Máquina no encontrada'}</p>
        </div>
      </div>
    );
  }

  return (
    <Checkout 
      machine={machine}
      router={router}
      {...checkoutLogic}
    />
  );
}
