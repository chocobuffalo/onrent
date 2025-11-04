// src/components/atoms/DiscountSummary/DiscountSummary.tsx
import React, { useMemo } from "react";
import { PricingInterface } from "@/components/organism/Catalogue/types";

interface Props {
  pricing: PricingInterface;
  dayLength: number;   // duración total en días
  unitPrice: number;   // precio por día (list_price)
  count: number;       // cantidad de máquinas
}

export default function DiscountSummary({ pricing, dayLength, unitPrice, count }: Props) {
  const weekFactor = Number(pricing.days_per_week_factor ?? 0);
  const monthFactor = Number(pricing.days_per_month_factor ?? 0);
  const weekDiscount = Number(pricing.discount_week ?? 0);
  const monthDiscount = Number(pricing.discount_month ?? 0);

  // 🔧 Helper que replica la lógica de Odoo
  const estimatedTotal = useMemo(() => {
    let rentPrice = 0;

    if (dayLength >= 30) {
      const fullMonths = Math.floor(dayLength / 30);
      const remaining = dayLength % 30;

      rentPrice += fullMonths * (unitPrice * monthFactor * (1 - monthDiscount));

      if (remaining >= 7) {
        const fullWeeks = Math.floor(remaining / 7);
        const extraDays = remaining % 7;

        rentPrice += fullWeeks * (unitPrice * weekFactor * (1 - weekDiscount));
        rentPrice += extraDays * unitPrice;
      } else {
        rentPrice += remaining * unitPrice;
      }
    } else if (dayLength >= 7) {
      const fullWeeks = Math.floor(dayLength / 7);
      const extraDays = dayLength % 7;

      rentPrice += fullWeeks * (unitPrice * weekFactor * (1 - weekDiscount));
      rentPrice += extraDays * unitPrice;
    } else {
      rentPrice = unitPrice * dayLength;
    }

    return Math.round(rentPrice * count * 100) / 100;
  }, [dayLength, unitPrice, count, weekFactor, monthFactor, weekDiscount, monthDiscount]);

  const baseSubtotal = unitPrice * count * dayLength;
  const ahorro = baseSubtotal - estimatedTotal;

  // Determinar umbral para el copy
  let threshold = 0;
  if (dayLength >= monthFactor && monthFactor > 0) {
    threshold = monthFactor;
  } else if (dayLength >= weekFactor && weekFactor > 0) {
    threshold = weekFactor;
  }

  return (
    <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-base font-semibold mb-3">Detalles del precio</h3>

      {/* Subtotal sin descuentos */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span>${baseSubtotal}</span>
      </div>

      {/* Si aplica beneficio */}
      {ahorro > 0 && (
        <div className="flex justify-between text-sm text-green-600 mt-1">
          <span>Beneficio por duración de la renta</span>
          <span>- ${ahorro.toFixed(2)}</span>
        </div>
      )}

      {/* Total estimado */}
      <div className="flex justify-between font-bold text-lg mt-3">
        <span>Total estimado</span>
        <span>${estimatedTotal}</span>
      </div>

      {/* Mensaje amigable */}
      {ahorro > 0 && threshold > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Precio especial por más de {threshold} días
        </p>
      )}

      <p className="text-xs text-gray-400 mt-2">
        El total final se confirmará en la orden.
      </p>
    </div>
  );
}
