'use client';

import React, { useState } from 'react';
import { Machine } from '@/types/checkout';

interface CheckoutSummaryProps {
  machine?: Machine;
}

export default function CheckoutSummary({ machine }: CheckoutSummaryProps) {
  const initial = {
    machines: [
      { id: 1, name: 'Retroexcavadora', price: 800, quantity: 1 },
      { id: 2, name: 'Grua', price: 1000, quantity: 2 },
    ],
    flete: 50,
    seguro: 200,
    impuestos: 30,
  };

  const [machines, setMachines] = useState(initial.machines);

  const handleIncrement = (id: number) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, quantity: m.quantity + 1 } : m))
    );
  };

  const handleDecrement = (id: number) => {
    setMachines((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, quantity: Math.max(1, m.quantity - 1) } : m
      )
    );
  };

  const rentaMaquinaria = machines.reduce(
    (sum, m) => sum + m.price * m.quantity,
    0
  );

  const total = rentaMaquinaria + initial.flete + initial.seguro + initial.impuestos;

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
                <button
                  type="button"
                  onClick={() => handleDecrement(item.id)}
                  className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-sm font-medium"
                >
                  −
                </button>

                <div className="w-7 h-7 flex items-center justify-center text-sm font-medium text-gray-900">
                  {item.quantity}
                </div>

                <button
                  type="button"
                  onClick={() => handleIncrement(item.id)}
                  className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-sm font-medium"
                >
                  +
                </button>
              </div>
              <span className="text-gray-900 text-base font-light lato-font">
                {item.name}
              </span>
            </div>
            <span className="text-gray-900 text-base  font-medium lato-font">
              {(item.price * item.quantity).toLocaleString('es-ES')}$/MXN
            </span>
          </div>
        ))}
      </div>
      <hr className="border-gray-300 mb-4" />
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base lato-font">Renta de Maquinaria:</span>
          <span className="text-gray-900 text-base font-light lato-font">
            {rentaMaquinaria.toLocaleString('es-ES')}$MXN
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base  lato-font">Flete:</span>
          <span className="text-gray-900 text-base  font-medium lato-font">
            {initial.flete.toLocaleString('es-ES')}$/MXN
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base  lato-font">Seguro:</span>
          <span className="text-gray-900 text-base  font-medium lato-font">
            {initial.seguro.toLocaleString('es-ES')}$/MXN
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base  lato-font">Impuestos:</span>
          <span className="text-gray-900 text-base  font-medium lato-font">
            {initial.impuestos.toLocaleString('es-ES')}$/MXN
          </span>
        </div>
      </div>
      <hr className="border-gray-300 my-4" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-base font-extralight lato-font">TOTAL</span>
        <span className="text-gray-900 text-base font-bold lato-font">
          {total.toLocaleString('es-ES')}$/MXN
        </span>
      </div>
    </div>
  );
}