'use client';

import { useRouter } from 'next/navigation';
import Checkout from '@/components/organism/Checkout/Checkout';
import { useMachineCheckout } from '@/hooks/frontend/buyProcess/useMachineCheckout';
import { useCheckout } from '@/hooks/frontend/buyProcess/useCheckout';
import { useUIAppDispatch, useUIAppSelector } from '@/libs/redux/hooks';
import { setOrderId, setSessionId } from '@/libs/redux/features/ui/orderSlicer';
import { useGetPreOrder } from '@/hooks/frontend/buyProcess/useGetPreOrder';

export default function CheckoutPage() {
  const router = useRouter();
 // console.log(router);
  const dispatch = useUIAppDispatch();
  const { order_id,session_id } = useUIAppSelector((state) => state.order);
  //get order_id from localstorage and set to redux

  if (!order_id && typeof window !== 'undefined') {
    const storedOrderId = localStorage.getItem('order_id');
    console.log(storedOrderId,'storedOrderId')
    if (storedOrderId) {
      //dispatch to redux
      //añdir dispatch
      dispatch(setOrderId(parseInt(storedOrderId)));
    }else{
      //redirect to home
      router.push('/');
    }
  }
  if(!session_id && typeof window !== 'undefined'){
    const storedSessionId = localStorage.getItem('session_id');
    if (storedSessionId) {
      //dispatch to redux
      //añdir dispatch
      dispatch(setSessionId(storedSessionId));
    }
  } 

  const {order, loading, getOrderError, fetchOrder} = useGetPreOrder(`${session_id}`||'');
  //console.log(order, getOrderError)
 

  const { machine, error } = useMachineCheckout('123');


  const checkoutLogic = useCheckout(router, machine || undefined);


  const isLoading = loading;

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
      //machine={machine}
      order={order}
      router={router}
      {...checkoutLogic}
    />
  );
}
