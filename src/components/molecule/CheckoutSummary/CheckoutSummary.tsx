'use client';

import React, { useEffect, useState } from 'react';
import { ItemProps, OrderProp } from '@/types/checkout';
import { useSession } from 'next-auth/react';

interface MachineItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutSummary({ 
  items,
  setGetCheckSummary,
  preorder_id,
  session_id,
  url,
  order
}:{
  items?: ItemProps[],
  setGetCheckSummary: (checkout: any) => void,
  preorder_id?: string,
  session_id?: string,
  url?: string,
  order?: OrderProp | null
}) {
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const { data: session } = useSession(); 
  const [userId, setUserId] = useState<number | null>(null);

  const machinesItems = items ? items.map((item) => ({
    id: item.product_id || Math.random().toString(36).substr(2, 9),
    name: item.product_name,
    price: item.estimated_rent,
    quantity: item.requested_quantity,
  })) : [];

  console.log('=== DEBUG ===');
  console.log('order.contract_total:', order?.contract_total);
  console.log('item.monthly_payment:', items?.[0]?.monthly_payment);

  useEffect(() => {
    if (items && machinesItems.length > 0) {
      setMachines(machinesItems);
      setUserId(parseInt(session?.user?.id || '0') || null);
      
      const item = items[0];
      const isMonthly = (item.duration_days || 0) >= 30;
      
      const amountToCharge = isMonthly 
        ? item.monthly_payment 
        : order?.contract_total;
      
      console.log('amountToCharge:', amountToCharge);
      
      setGetCheckSummary({
        amount: amountToCharge || 0,
        currency: 'mxn',
        preorder_id: preorder_id || '',
        session_id: session_id || ''
      });
    }
  }, [items, order, preorder_id, session_id, session?.user?.id]);

  if (!items || items.length === 0) return null;

  const item = items[0];
  const isMonthly = (item.duration_days || 0) >= 30;

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white">
      <h4 className="text-gray-900 text-lg font-semibold mb-4 lato-font">
        Detalles del precio
      </h4>

      <div className="space-y-4 mb-6">
        {machines.map((machine) => (
          <div key={machine.id} className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-7 h-7 flex items-center justify-center text-sm font-medium text-gray-900">
                  {machine.quantity}
                </div>
              </div>
              <span className="text-gray-900 text-base font-light lato-font">
                {machine.name}
              </span>
            </div>
            <span className="text-gray-900 text-base font-medium lato-font">
              {machine.price.toLocaleString('es-MX')}$/MXN
            </span>
          </div>
        ))}
      </div>

      <hr className="border-gray-300 mb-4" />

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base lato-font">Renta de Maquinaria:</span>
          <span className="text-gray-900 text-base font-light lato-font">
            {(order?.estimated_rent || 0).toLocaleString('es-MX')}$MXN
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base lato-font">Flete:</span>
          <span className="text-gray-900 text-base font-medium lato-font">
            {(item.estimated_fleet || 0).toLocaleString('es-MX')}$/MXN
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base lato-font">Extras:</span>
          <span className="text-gray-900 text-base font-medium lato-font">
            {(item.estimated_extras || 0).toLocaleString('es-MX')}$/MXN
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base lato-font">Impuestos:</span>
          <span className="text-gray-900 text-base font-medium lato-font">
            {(item.estimated_taxes || 0).toLocaleString('es-MX')}$/MXN
          </span>
        </div>
      </div>

      <hr className="border-gray-300 my-4" />

      <input type="hidden" name="user_id" value={userId || ''} />
      <input type="hidden" name="currency" value="mxn" />
      <input 
        type="hidden" 
        name="amount" 
        value={isMonthly ? (item.monthly_payment || 0) : (order?.contract_total || 0)} 
      />
      <input type="hidden" name="method" value="card" />

      {isMonthly ? (
        //Rentas >= 30 días (mensuales)
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-base font-extralight lato-font">
              TOTAL RENTA
            </span>
            <span className="text-gray-900 text-base font-bold lato-font">
              {(order?.contract_total || 0).toLocaleString('es-MX')}$/MXN
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-base font-extralight lato-font">
              HOY PAGAS
            </span>
            <span className="text-gray-900 text-base font-bold lato-font">
              {(item.monthly_payment || 0).toLocaleString('es-MX')}$/MXN
            </span>
          </div>
        </>
      ) : (
        //Rentas menores a 30 días
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base font-extralight lato-font">
            TOTAL RENTA
          </span>
          <span className="text-gray-900 text-base font-bold lato-font">
            {(order?.contract_total || 0).toLocaleString('es-MX')}$/MXN
          </span>
        </div>
      )}
    </div>
  );
}
