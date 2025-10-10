'use client';

import React, { use, useEffect, useState } from 'react';
import { ItemProps, Machine } from '@/types/checkout';
import { useSession } from 'next-auth/react';

interface CheckoutSummaryProps {
  machine?: Machine;
}

interface MachineItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutSummary({ items,setGetCheckSummary,preorder_id,session_id,url }:{items?:ItemProps[],setGetCheckSummary:(checkout:any)=>void,preorder_id?:string,session_id?:string,url?:string}) {
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const {data:session} = useSession(); 
  const [fleet, setFleet] = useState(0);
  const [extras, setExtras] = useState(0);
  const [rents, setRents] = useState(0);
  const [tax, setTax] = useState(0);
  const [userId,setUserId] = useState<number | null>(null);
  const [totalPrice,setTotalPrice] = useState(0);

  const machinesItems = items ? items?.map((item) => ({
    id: item.product_id || Math.random().toString(36).substr(2, 9),
    name: item.product_name,
    price: item.estimated_rent,
    quantity: item.requested_quantity,
  })): [];
  
  const initial = {
    machines: [
      { id: 1, name: 'Retroexcavadora', price: 800, quantity: 1 },
      { id: 2, name: 'Grua', price: 1000, quantity: 2 },
    ],
    flete: 50,
    seguro: 200,
    impuestos: 30,
  };

  useEffect(() => {
    if(items && machinesItems.length > 0){
      setMachines(machinesItems );
      setUserId(parseInt(session?.user?.id||'0') || null);
     
      const fleetSum = items.reduce((sum, item) => sum + (item.estimated_fleet || 0), 0);
      setFleet(fleetSum);
      
      const extrasSum = items.reduce((sum, item) => sum + (item.estimated_extras || 0), 0);
      setExtras(extrasSum);
      
      const rentsSum = items.reduce((sum, item) => sum + (item.estimated_rent || 0), 0);
      setRents(rentsSum);
      
      const taxSum = items.reduce((sum, item) => sum + (item.estimated_taxes || 0), 0);
      setTax(taxSum);
      
      let totalSum = 0;
      
      items.forEach((item) => {
        const durationDays = item.duration_days || 0;
        
        if (durationDays < 30) {
          const itemTotal = (item.estimated_fleet || 0) + 
                           (item.estimated_rent || 0) + 
                           (item.estimated_taxes || 0)
          totalSum += itemTotal;
        } else {
          totalSum += (item.monthly_payment || 0);
        }
      });
      
      setTotalPrice(totalSum);
      
      setGetCheckSummary((prev: Record<string, any>) => ({
        ...prev,
        amount: totalSum,
        currency: 'mxn',
        preorder_id: preorder_id || '',
        session_id: session_id || ''
      }))
    };
  }, [items, preorder_id, session_id]);

  const handleIncrement = (id: number | string) => {
    setMachines((prev) =>
      prev?.map((m) => (m.id === id ? { ...m, quantity: m.quantity + 1 } : m))
    );
  };

  const handleDecrement = (id: number| string) => {
    setMachines((prev) =>
      prev?.map((m) =>
        m.id === id ? { ...m, quantity: Math.max(1, m.quantity - 1) } : m
      )
    );
  };

  const rentaMaquinaria = machines?.reduce(
    (sum, m) => sum + m.price * m.quantity,
    0
  );

  const total = rentaMaquinaria + initial.flete + initial.seguro + initial.impuestos;

  if(!items) return null;
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white">
      <h4 className="text-gray-900 text-lg font-semibold mb-4 lato-font">
        Detalles del precio
      </h4>
      <div className="space-y-4 mb-6">
        {machines.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-7 h-7 flex items-center justify-center text-sm font-medium text-gray-900">
                  {item.quantity}
                </div>
              </div>
              <span className="text-gray-900 text-base font-light lato-font">
                {item.name}
              </span>
            </div>
            <span className="text-gray-900 text-base  font-medium lato-font">
              {(item.price).toLocaleString('es-MX')}$/MXN
            </span>
          </div>
        ))}
      </div>
      <hr className="border-gray-300 mb-4" />
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base lato-font">Renta de Maquinaria:</span>
          <span className="text-gray-900 text-base font-light lato-font">
            {rents.toLocaleString('es-MX')}$MXN
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base  lato-font">Flete:</span>
          <span className="text-gray-900 text-base  font-medium lato-font">
            {fleet.toLocaleString('es-MX')}$/MXN
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base  lato-font">Extras:</span>
          <span className="text-gray-900 text-base  font-medium lato-font">
            {extras.toLocaleString('es-MX')}$/MXN
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base  lato-font">Impuestos:</span>
          <span className="text-gray-900 text-base  font-medium lato-font">
            {tax.toLocaleString('es-MX')}$/MXN
          </span>
        </div>
      </div>
      <hr className="border-gray-300 my-4" />

      <input type="hidden" name="user_id" value={userId || ''} />
      <input type="hidden" name="currency" value="mxn" />
      <input type="hidden" name="amount" value={totalPrice || 0} />
      <input type="hidden" name="method" value="card" />

      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-base font-extralight lato-font">TOTAL</span>
        <span className="text-gray-900 text-base font-bold lato-font">
          {totalPrice.toLocaleString('es-MX')}$/MXN
        </span>
      </div>
    </div>
  );
}
